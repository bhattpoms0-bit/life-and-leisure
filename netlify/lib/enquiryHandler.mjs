import { createHash } from 'node:crypto'
import { ENQUIRY_ENDPOINT, PRIVACY_NOTICE } from '../../src/data/enquiryConfig.js'
import { createEnquiryContext, getServiceFields } from '../../src/lib/serviceEnquiry.js'
import { isRecord, isSingleLine, validateEnquiry } from '../../src/lib/enquiryValidation.js'
import { getEmailConfiguration } from './emailConfiguration.mjs'
import { buildEnquiryEmail } from './enquiryEmail.mjs'

export const MAX_REQUEST_BYTES = 24576
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const onlyKeys = (value, keys) => isRecord(value) && Object.keys(value).every(key => keys.includes(key))
const reply = (status, data, extraHeaders = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders } })
const unavailable = () => reply(503, { accepted: false, message: 'Online enquiries are not available. Nothing was sent.' })

function validatePayload(payload, now, notice) {
  if (!onlyKeys(payload, ['schemaVersion', 'serviceType', 'customer', 'travel', 'additionalRequirements', 'metadata', 'privacyNoticeVersion', 'honeypot']) || payload.schemaVersion !== 1) return { serviceType: 'Invalid enquiry format.' }
  if (!onlyKeys(payload.customer, ['fullName', 'email', 'phone', 'country', 'privacyAcknowledged']) || !isRecord(payload.travel) || !onlyKeys(payload.metadata, ['sourcePath', 'packageSlug', 'destination', 'experience', 'clientRequestId', 'submittedAt'])) return { serviceType: 'Invalid enquiry format.' }
  if (typeof payload.honeypot !== 'string' || payload.honeypot.length > 200 || payload.honeypot.trim()) return { serviceType: 'Unable to accept this enquiry.' }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  const errors = validateEnquiry(payload, today)
  if (payload.privacyNoticeVersion !== notice.version) errors.privacyAcknowledged = 'Please reload and read the current privacy information.'
  for (const key of ['phone', 'country']) if (payload.customer[key] !== undefined && typeof payload.customer[key] !== 'string') errors[key] = 'Enter valid contact details.'
  const allowedTravel = [...getServiceFields(payload.serviceType, payload.travel).map(field => field.name), ...(payload.serviceType === 'flights' && payload.travel.tripType === 'Multi-city' ? ['extraFlights'] : [])]
  for (const [key, value] of Object.entries(payload.travel)) {
    if (!allowedTravel.includes(key) || (key !== 'extraFlights' && !isSingleLine(value))) errors.serviceType = 'Review the travel fields for the selected service.'
  }
  for (const value of Object.values(payload.metadata)) {
    if (!isSingleLine(value) || value.length > 200) return { ...errors, serviceType: 'Invalid enquiry context.' }
  }
  const { clientRequestId, submittedAt, sourcePath, packageSlug } = payload.metadata
  if (!UUID.test(clientRequestId ?? '')) errors.serviceType = 'Please reload the enquiry form.'
  const timestamp = Date.parse(submittedAt)
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString() !== submittedAt || timestamp > now.getTime() + 300000 || timestamp < now.getTime() - 86400000) errors.serviceType = 'Please reload the enquiry form.'
  if (sourcePath && (!sourcePath.startsWith('/') || sourcePath.startsWith('//'))) errors.serviceType = 'Invalid source page.'
  if (packageSlug && (payload.serviceType !== 'holidays' || !/^[a-z0-9-]{1,120}$/.test(packageSlug))) errors.serviceType = 'Review the package reference.'
  return errors
}

export async function boundedJson(request) {
  const length = request.headers.get('content-length')
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_REQUEST_BYTES)) throw new RangeError('size')
  const reader = request.body?.getReader()
  if (!reader) throw new SyntaxError('body')
  const chunks = []; let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_REQUEST_BYTES) { await reader.cancel(); throw new RangeError('size') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)))
}

// Dependencies are injectable for offline tests. The deployed entry uses defaults.
// No application logs, customer database, provider-body echoing or automatic retries.
export function createEmailEnquiryHandler({ env = process.env, requestEmail = globalThis.fetch, now = () => new Date(), notice = PRIVACY_NOTICE } = {}) {
  return async (request, context = {}) => {
    try {
      if (request.method !== 'POST') return reply(405, { accepted: false, message: 'Method not allowed.' }, { Allow: 'POST' })
      const url = new URL(request.url)
      if (url.pathname !== ENQUIRY_ENDPOINT) return reply(404, { accepted: false, message: 'Not found.' })
      const settings = getEmailConfiguration(env, notice.approved)
      if (!settings) return unavailable()
      // Runtime Context is supplied by Netlify, not by the request body/headers.
      if (context.site?.id !== settings.siteId || context.deploy?.context !== settings.context) return unavailable()
      if (url.origin !== settings.origin || request.headers.get('origin') !== settings.origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403, { accepted: false, message: 'Request not permitted.' })
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') ?? '') || !['', 'identity'].includes(request.headers.get('content-encoding') ?? '')) return reply(415, { accepted: false, message: 'Use an uncompressed JSON request.' })
      let payload
      try { payload = await boundedJson(request) } catch (error) { return reply(error instanceof RangeError ? 413 : 400, { accepted: false, message: 'Invalid or oversized enquiry request.' }) }
      const errors = validatePayload(payload, now(), notice)
      if (Object.keys(errors).length) return reply(422, { accepted: false, errors, message: 'Please review the enquiry fields.' })
      const clean = createEnquiryContext(payload.serviceType, payload.travel, payload.metadata)
      const enquiry = {
        ...clean, customer: { fullName: payload.customer.fullName.trim(), email: payload.customer.email.trim(), phone: payload.customer.phone?.trim() ?? '', country: payload.customer.country?.trim() ?? '', privacyAcknowledged: true },
        metadata: { ...clean.metadata, clientRequestId: payload.metadata.clientRequestId, submittedAt: payload.metadata.submittedAt },
        additionalRequirements: (payload.additionalRequirements ?? '').trim(), privacyNoticeVersion: notice.version,
      }
      const reference = `LL-${enquiry.metadata.clientRequestId}`
      const message = buildEnquiryEmail(enquiry, reference)
      const digest = createHash('sha256').update(JSON.stringify(enquiry)).digest('hex')
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      try {
        const response = await requestEmail('https://api.resend.com/emails', {
          method: 'POST', signal: controller.signal, redirect: 'error',
          headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `enquiry/${enquiry.metadata.clientRequestId}/${digest}` },
          body: JSON.stringify({ from: `Life & Leisure Travel <${settings.from}>`, to: [settings.to], reply_to: enquiry.customer.email, ...message }),
        })
        if (!response.ok) return reply(502, { accepted: false, message: 'Email acceptance could not be confirmed. Please retry or use our official email.' })
        const accepted = await response.json()
        if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(accepted?.id ?? '')) return reply(502, { accepted: false, message: 'Email acceptance could not be confirmed.' })
        return reply(200, { accepted: true, reference, message: 'Accepted by the email provider for sending; inbox delivery is not confirmed.' })
      } finally { clearTimeout(timeout) }
    } catch {
      return reply(502, { accepted: false, message: 'Email acceptance could not be confirmed. Please retry or use our official email.' })
    }
  }
}
