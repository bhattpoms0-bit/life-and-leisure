import { createEnquiryContext } from './serviceEnquiry.js'
import { ENQUIRY_ENDPOINT, PRIVACY_NOTICE, intakeAvailability } from '../data/enquiryConfig.js'
import { validateEnquiry } from './enquiryValidation.js'
import { businessDetails } from '../data/businessDetails.js'

export const SUCCESS_MESSAGE = 'Thank you for contacting Life & Leisure.\n\nOur email provider has accepted your enquiry for sending to our team. This does not confirm delivery to the inbox.\n\nThis is a travel enquiry, not a confirmed booking.'
export const ERROR_MESSAGE = `We couldn't confirm receipt of your enquiry.\n\nPlease try again or email ${businessDetails.email}.`
export { validateEnquiry } from './enquiryValidation.js'

export function encodeEnquiry(enquiry, honeypot = '') {
  const context = createEnquiryContext(enquiry.serviceType, enquiry.travel, enquiry.metadata)
  return JSON.stringify({
    schemaVersion: 1,
    serviceType: context.serviceType,
    customer: {
      fullName: enquiry.customer.fullName.trim(), email: enquiry.customer.email.trim(),
      phone: enquiry.customer.phone?.trim() ?? '', country: enquiry.customer.country?.trim() ?? '',
      privacyAcknowledged: enquiry.customer.privacyAcknowledged === true,
    },
    travel: context.travel,
    additionalRequirements: (enquiry.additionalRequirements ?? '').trim(),
    metadata: { ...context.metadata, clientRequestId: enquiry.metadata?.clientRequestId ?? '', submittedAt: enquiry.metadata?.submittedAt ?? '' },
    privacyNoticeVersion: PRIVACY_NOTICE.version,
    honeypot: String(honeypot).slice(0, 200),
  })
}

// One instance per mounted form. The synchronous lock precedes any await.
// The server uses provider idempotency for identical retries within its retention window.
export function createEnquirySubmitter({ request = globalThis.fetch, onState = () => {}, availability = {}, today } = {}) {
  let busy = false
  let accepted = false
  return async (enquiry, honeypot = '') => {
    if (busy || accepted) return { ignored: true }
    busy = true
    onState({ status: 'VALIDATING', errors: {}, message: '' })
    try {
      const errors = validateEnquiry(enquiry, today)
      if (Object.keys(errors).length) {
        const result = { status: 'ERROR', errors, message: 'Please review the highlighted fields.' }
        onState(result); return result
      }
      const blocked = intakeAvailability(availability)
      if (blocked) {
        const result = { status: 'ERROR', errors: {}, message: `${blocked} Nothing was submitted.` }
        onState(result); return result
      }
      onState({ status: 'SUBMITTING', errors: {}, message: '' })
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      try {
        const response = await request(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: encodeEnquiry(enquiry, honeypot), signal: controller.signal })
        const data = await response.json()
        if (response.status === 422 && data?.errors && typeof data.errors === 'object') {
          const result = { status: 'ERROR', errors: data.errors, message: 'Please review the highlighted fields.' }
          onState(result); return result
        }
        if (!response.ok || data?.accepted !== true || typeof data.reference !== 'string') throw new Error('Email acceptance was not confirmed')
      } finally { clearTimeout(timeout) }
      accepted = true
      const result = { status: 'SUCCESS', errors: {}, message: SUCCESS_MESSAGE }
      onState(result); return result
    } catch {
      const result = { status: 'ERROR', errors: {}, message: ERROR_MESSAGE }
      onState(result); return result
    } finally { busy = false }
  }
}
