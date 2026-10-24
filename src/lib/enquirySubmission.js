import { createEnquiryContext, createEnquiryDraft, validateTravel } from './serviceEnquiry.js'
import { ENQUIRY_FORM_NAME, PRIVACY_NOTICE, intakeAvailability } from '../data/enquiryConfig.js'

export const SUCCESS_MESSAGE = 'Thank you for contacting Life & Leisure.\n\nYour travel enquiry has been received.\n\nOur team will review your requirements and contact you regarding the next steps.\n\nThis acknowledgement is not a booking confirmation.'
export const ERROR_MESSAGE = "We couldn't confirm receipt of your enquiry.\n\nPlease try again or contact Life & Leisure through our official contact details."
const singleLine = value => typeof value === 'string' && !/[\r\n]/.test(value) && !value.includes('\u0000')

export function validateEnquiry(enquiry, today) {
  const { customer = {}, serviceType, travel = {}, additionalRequirements = '' } = enquiry
  const errors = validateTravel(serviceType, travel, today)
  if (!singleLine(customer.fullName) || customer.fullName.trim().length < 2 || customer.fullName.length > 120) errors.fullName = 'Enter your full name (2–120 characters).'
  if (!singleLine(customer.email) || customer.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = 'Enter a valid email address.'
  if (customer.phone && (!singleLine(customer.phone) || customer.phone.length > 40 || !/^\+?[\d ()-]+$/.test(customer.phone) || !/^[0-9]{7,15}$/.test(customer.phone.replace(/\D/g, '')))) errors.phone = 'Enter 7–15 digits, optionally with +, spaces, brackets or hyphens.'
  if (customer.country && (!singleLine(customer.country) || customer.country.length > 80)) errors.country = 'Enter a country of at most 80 characters.'
  if (customer.privacyAcknowledged !== true) errors.privacyAcknowledged = 'Please acknowledge the privacy information.'
  if (typeof additionalRequirements !== 'string' || additionalRequirements.length > 5000 || additionalRequirements.includes('\u0000')) errors.additionalRequirements = 'Use at most 5,000 characters for additional requirements.'
  return errors
}

export function encodeEnquiry(enquiry, honeypot = '') {
  const context = createEnquiryContext(enquiry.serviceType, enquiry.travel, enquiry.metadata)
  const customer = enquiry.customer
  return new URLSearchParams({
    'form-name': ENQUIRY_FORM_NAME, 'bot-field': String(honeypot).slice(0, 200), schema_version: '1',
    service_type: context.serviceType, customer_name: customer.fullName.trim(), email: customer.email.trim(),
    phone: customer.phone?.trim() ?? '', country: customer.country?.trim() ?? '',
    privacy_acknowledged: customer.privacyAcknowledged === true ? 'yes' : 'no', privacy_notice_version: PRIVACY_NOTICE.version,
    travel_details: JSON.stringify(context.travel), travel_summary: createEnquiryDraft(context.serviceType, context.travel),
    additional_requirements: enquiry.additionalRequirements.trim(), client_request_id: String(enquiry.metadata?.clientRequestId ?? '').slice(0, 80),
    source_path: context.metadata.sourcePath ?? '', package_slug: context.metadata.packageSlug ?? '',
    destination_context: context.metadata.destination ?? '', experience_context: context.metadata.experience ?? '',
  }).toString()
}

// One instance per mounted form. The synchronous lock precedes any await.
// Request IDs aid staff reconciliation; they are not server-side deduplication.
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
        const response = await request('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodeEnquiry(enquiry, honeypot), signal: controller.signal })
        if (!response.ok) throw new Error('Provider did not accept the request')
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
