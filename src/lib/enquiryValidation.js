import { validateTravel } from './serviceEnquiry.js'

export const isRecord = value => !!value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype
export const isSingleLine = value => typeof value === 'string' && [...value].every(character => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127)
const unsafeMessageControls = value => [...value].some(character => {
  const code = character.codePointAt(0)
  return (code < 32 && ![9, 10, 13].includes(code)) || code === 127
})
export function isEmail(value) {
  if (!isSingleLine(value) || value.length > 254) return false
  const parts = value.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (new TextEncoder().encode(local).byteLength > 64) return false
  // Support ordinary ASCII mailboxes; quoted and internationalized syntax is unsupported.
  if (!local.split('.').every(atom => /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+$/.test(atom))) return false
  const labels = domain.split('.')
  return labels.length >= 2 && labels.every(label => label.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label))
}

// Shared by browser and server; the server also checks the transport schema.
export function validateEnquiry(enquiry, today) {
  if (!isRecord(enquiry)) return { serviceType: 'Please enter valid enquiry details.' }
  const { serviceType, additionalRequirements = '' } = enquiry
  const customer = isRecord(enquiry.customer) ? enquiry.customer : {}
  const travel = isRecord(enquiry.travel) ? enquiry.travel : {}
  const errors = validateTravel(serviceType, travel, today)
  if (!isRecord(enquiry.travel)) errors.serviceType = 'Please enter valid travel details.'
  if (!isSingleLine(customer.fullName) || customer.fullName.trim().length < 2 || customer.fullName.length > 120) errors.fullName = 'Enter your full name (2–120 characters).'
  if (!isSingleLine(customer.email) || !isEmail(customer.email.trim())) errors.email = 'Enter a valid email address.'
  if (customer.phone && (!isSingleLine(customer.phone) || customer.phone.length > 40 || !/^\+?[\d ()-]+$/.test(customer.phone) || !/^[0-9]{7,15}$/.test(customer.phone.replace(/\D/g, '')))) errors.phone = 'Enter 7–15 digits, optionally with +, spaces, brackets or hyphens.'
  if (customer.country && (!isSingleLine(customer.country) || customer.country.length > 80)) errors.country = 'Enter a country of at most 80 characters.'
  if (customer.privacyAcknowledged !== true) errors.privacyAcknowledged = 'Please acknowledge the privacy information.'
  if (typeof additionalRequirements !== 'string' || additionalRequirements.length > 5000 || unsafeMessageControls(additionalRequirements)) errors.additionalRequirements = 'Use at most 5,000 characters for additional requirements.'
  return errors
}
