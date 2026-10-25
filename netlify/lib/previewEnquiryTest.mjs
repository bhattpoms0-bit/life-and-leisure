import { createHash } from 'node:crypto'
import { PRIVACY_NOTICE } from '../../src/data/enquiryConfig.js'
import { isRecord, validateEnquiry } from '../../src/lib/enquiryValidation.js'
import { boundedJson } from './enquiryHandler.mjs'
import { buildEnquiryEmail } from './enquiryEmail.mjs'
import { authorizePreviewPermit, previewTestSettings, PREVIEW_FIXTURE_ID, PREVIEW_TEST_ENDPOINT, PREVIEW_TEST_ORIGIN, PREVIEW_TEST_SITE_ID } from './previewTestAuthorization.mjs'

export const PREVIEW_TEST_FROM = 'notifications@mail.lifeandleisure.travel'
export const PREVIEW_TEST_TO = 'enquiries@lifeandleisure.travel'
export const PREVIEW_TEST_SUBJECT = '[TEST] Life & Leisure Enquiry — Synthetic delivery verification'
export const SYNTHETIC_PREVIEW_ENQUIRY = Object.freeze({
  serviceType: 'travel_consultation',
  customer: Object.freeze({ fullName: 'Synthetic Preview Traveller — Fictional Test', email: PREVIEW_TEST_TO, phone: '', country: '', privacyAcknowledged: true }),
  travel: Object.freeze({ topic: 'Fictional visit to Imaginary Island; delivery test only', destination: 'Imaginary Island (fictional)', period: 'Fictional planning exercise; no dates or booking' }),
  additionalRequirements: 'Synthetic verification only. No real customer, travel documents, payment or booking. Do not arrange travel.',
  metadata: Object.freeze({ sourcePath: PREVIEW_TEST_ENDPOINT }),
  privacyNoticeVersion: PRIVACY_NOTICE.version,
})

const reply = (status, message, extra = {}) => Response.json({ accepted: false, message, ...extra }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(status === 405 ? { Allow: 'POST' } : {}) } })
const unavailable = () => reply(503, 'Preview email testing is disabled or unavailable. Nothing was sent.')
const fixedEnvelope = payload => {
  const keys = ['fixtureId', 'syntheticAcknowledged', 'privacyNoticeVersion', 'honeypot']
  return isRecord(payload) && Object.keys(payload).length === keys.length && Object.keys(payload).every(key => keys.includes(key)) && payload.fixtureId === PREVIEW_FIXTURE_ID && payload.syntheticAcknowledged === true && payload.privacyNoticeVersion === PRIVACY_NOTICE.version && payload.honeypot === ''
}

// The deployed entry uses defaults. Only offline tests inject env/clock/provider.
// No normal-intake approval override, application logs, storage or automatic retries.
export function createPreviewEnquiryTestHandler({ env = process.env, now = () => new Date(), requestEmail = globalThis.fetch } = {}) {
  let activeRun = null // Warm-instance coalescing, not a distributed once-only lock.
  return async (request, context = {}) => {
    try {
      if (request.method !== 'POST') return reply(405, 'Method not allowed.')
      const url = new URL(request.url)
      if (url.pathname !== PREVIEW_TEST_ENDPOINT) return reply(404, 'Not found.')
      const settings = previewTestSettings(env, context)
      if (!settings) return unavailable()
      if (url.origin !== PREVIEW_TEST_ORIGIN || request.headers.get('origin') !== PREVIEW_TEST_ORIGIN || request.headers.get('sec-fetch-site') === 'cross-site') return reply(403, 'Request not permitted.')
      const authorization = request.headers.get('authorization')
      if (!authorizePreviewPermit(authorization, settings, now())) return reply(403, 'A valid, unexpired permit for this preview deploy is required.')
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') ?? '') || !['', 'identity'].includes(request.headers.get('content-encoding') ?? '')) return reply(415, 'Use an uncompressed JSON request.')
      let payload
      try { payload = await boundedJson(request) } catch (error) { return reply(error instanceof RangeError ? 413 : 400, 'Invalid or oversized test request.') }
      if (!fixedEnvelope(payload)) return reply(422, 'Only the fixed synthetic fixture and synthetic-only acknowledgement are accepted.')
      if (Object.keys(validateEnquiry(SYNTHETIC_PREVIEW_ENQUIRY)).length) return unavailable()
      // Do not send if the permit expires while the request is being read.
      const currentSettings = previewTestSettings(env, context)
      if (!currentSettings || !authorizePreviewPermit(authorization, currentSettings, now())) return reply(403, 'Test authorization is no longer valid.')
      const runId = createHash('sha256').update(JSON.stringify({ fixture: SYNTHETIC_PREVIEW_ENQUIRY, siteId: PREVIEW_TEST_SITE_ID, deployId: settings.deployId })).digest('hex')
      if (activeRun?.id === runId) return (await activeRun.response).clone()
      const reference = `LL-PREVIEW-${runId.slice(0, 24)}`
      const message = buildEnquiryEmail(SYNTHETIC_PREVIEW_ENQUIRY, reference)
      message.subject = PREVIEW_TEST_SUBJECT
      for (const format of ['text', 'html']) {
        message[format] = message[format].replace('Privacy acknowledgement', 'Synthetic-only acknowledgement (not policy approval)').replace('Source page (customer-supplied)', 'Synthetic endpoint (server-configured)')
      }
      message.text = `TEST ENVIRONMENT — SYNTHETIC DATA ONLY\n${message.text}\n\nApproved preview deploy: ${settings.deployId}`
      message.html = message.html.replace('<h1 ', `<p><strong>TEST ENVIRONMENT — SYNTHETIC DATA ONLY</strong></p><p>Approved preview deploy: ${settings.deployId}</p><h1 `)
      const send = async () => {
        if (!authorizePreviewPermit(authorization, currentSettings, now())) return reply(403, 'Test authorization is no longer valid.')
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        try {
          const response = await requestEmail('https://api.resend.com/emails', {
            method: 'POST', signal: controller.signal, redirect: 'error',
            headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `preview/${runId}` },
            body: JSON.stringify({ from: `Life & Leisure Travel <${PREVIEW_TEST_FROM}>`, to: [PREVIEW_TEST_TO], reply_to: PREVIEW_TEST_TO, ...message }),
          })
          if (!response.ok) return reply(502, 'Provider acceptance could not be confirmed. Inspect provider records before any retry.')
          const result = await response.json()
          if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(result?.id ?? '')) return reply(502, 'Provider acceptance could not be confirmed.')
          return reply(200, 'Synthetic email accepted by the provider for sending. Inbox delivery is not confirmed.', { accepted: true, reference })
        } catch { return reply(502, 'Provider acceptance could not be confirmed. Inspect provider records before any retry.') }
        finally { clearTimeout(timeout) }
      }
      const run = { id: runId, response: send() }
      activeRun = run
      const response = await run.response
      if (!response.ok && activeRun === run) activeRun = null
      return response.clone()
    } catch { return reply(502, 'Synthetic email acceptance could not be confirmed.') }
  }
}
