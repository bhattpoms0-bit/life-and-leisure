import test from 'node:test'
import assert from 'node:assert/strict'
import { createEnquiryContext, enquiryServices, switchEnquiryService } from '../src/lib/serviceEnquiry.js'
import { encodeEnquiry, validateEnquiry, createEnquirySubmitter, ERROR_MESSAGE } from '../src/lib/enquirySubmission.js'
import { intakeAvailability } from '../src/data/enquiryConfig.js'
import { businessDetails } from '../src/data/businessDetails.js'

const customer = { fullName: 'Synthetic Traveller', email: 'test@example.com', phone: '+91 98765 43210', country: 'India', privacyAcknowledged: true }
const initial = () => ({ ...createEnquiryContext('holidays', { destination: 'Kyoto', travellers: '2', budget: '150000', currency: 'INR', month: '2027-02', preferences: 'Package season' }, { sourcePath: '/packages/example', packageSlug: 'example', destination: 'Kyoto', experience: 'Signature escape' }), customer: { ...customer }, additionalRequirements: '' })

test('consultation is an additional service with validation and canonical encoding', () => {
  assert.deepEqual(enquiryServices.map(item => item.key), ['flights', 'hotels', 'trains', 'visa', 'holidays', 'tailor_made', 'inbound_india', 'travel_consultation'])
  const input = { ...initial(), ...createEnquiryContext('travel_consultation', { topic: 'Compare travel options', destination: 'Japan', period: 'Spring' }) }
  assert.deepEqual(validateEnquiry(input, '2026-10-25'), {})
  assert.ok(validateEnquiry({ ...input, travel: { topic: ' ' } }).topic)
  const payload = new URLSearchParams(encodeEnquiry(input))
  assert.equal(payload.get('service_type'), 'travel_consultation')
  assert.match(payload.get('travel_summary'), /Travel Consultation enquiry/)
})

test('switching clears package/experience context and submits current service only', () => {
  const original = initial()
  const snapshot = structuredClone(original)
  const switched = { ...original, ...switchEnquiryService(original, 'hotels') }
  assert.deepEqual(switched.customer, customer)
  assert.deepEqual(switched.travel, { destination: 'Kyoto', guests: '2' })
  assert.deepEqual(switched.metadata, { sourcePath: '/packages/example' })
  const payload = new URLSearchParams(encodeEnquiry(switched))
  assert.equal(payload.get('service_type'), 'hotels')
  for (const field of ['package_slug', 'experience_context', 'destination_context']) assert.equal(payload.get(field), '')
  assert.equal(payload.get('email'), customer.email)
  assert.doesNotMatch(payload.get('travel_details'), /budget|month|preferences/)
  assert.deepEqual(original, snapshot)
  // Returning to the original service can restore its draft, never old metadata.
  const back = switchEnquiryService(switched, 'holidays', original.travel)
  assert.deepEqual(back.travel, original.travel)
  assert.equal(back.metadata.packageSlug, undefined)
  assert.equal(back.metadata.experience, undefined)
})

test('switching preserves saved drafts and avoids ambiguous destinations and dates', () => {
  const original = initial()
  assert.equal(switchEnquiryService(original, 'hotels', { destination: 'Osaka', rooms: '1' }).travel.destination, 'Osaka')
  assert.equal(switchEnquiryService(original, 'visa').travel.destination, undefined)
  const inbound = createEnquiryContext('inbound_india', { destination: 'Rajasthan', departure: '2027-02-10', travellers: '3' }, { experience: 'India tour' })
  const flight = switchEnquiryService(inbound, 'flights')
  assert.deepEqual(flight.travel, { passengers: '3' })
  assert.equal(flight.metadata.experience, undefined)
  assert.deepEqual(switchEnquiryService(original, 'holidays').metadata, original.metadata)
  assert.equal(switchEnquiryService(original, 'travel_consultation').travel.destination, 'Kyoto')
})

test('preview matching requires an explicitly configured project and exact deploy-preview pattern', () => {
  const config = { enabled: true, privacyApproved: true, previewSiteName: 'life-leisure-test' }
  for (const hostname of ['lifeandleisure.travel', 'www.lifeandleisure.travel', 'deploy-preview-12--life-leisure-test.netlify.app']) assert.equal(intakeAvailability({ ...config, hostname }), '')
  for (const hostname of ['localhost', 'unrelated.netlify.app', 'deploy-preview-12--other.netlify.app', 'branch--life-leisure-test.netlify.app', 'life-leisure-test.netlify.app', 'deploy-preview-12--life-leisure-test.netlify.app.evil.example']) assert.notEqual(intakeAvailability({ ...config, hostname }), '')
  assert.notEqual(intakeAvailability({ ...config, hostname: 'deploy-preview-12--life-leisure-test.netlify.app', previewSiteName: '' }), '')
  assert.notEqual(intakeAvailability({ ...config, hostname: 'lifeandleisure.travel', privacyApproved: false }), '')
})

test('provider failure includes the central business email without changing entered data', async () => {
  const input = initial()
  const before = structuredClone(input)
  const submit = createEnquirySubmitter({ today: '2026-10-25', availability: { enabled: true, privacyApproved: true, hostname: 'lifeandleisure.travel' }, request: async () => ({ ok: false }) })
  const result = await submit(input)
  assert.equal(result.status, 'ERROR')
  assert.equal(result.message, ERROR_MESSAGE)
  assert.ok(result.message.includes(businessDetails.email))
  assert.deepEqual(input, before)
})
