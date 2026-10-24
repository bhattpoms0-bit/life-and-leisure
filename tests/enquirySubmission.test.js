import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createEnquiryContext, validateTravel, isCalendarDate } from '../src/lib/serviceEnquiry.js'
import { createEnquirySubmitter, validateEnquiry, encodeEnquiry, SUCCESS_MESSAGE, ERROR_MESSAGE } from '../src/lib/enquirySubmission.js'
import { ENQUIRY_FORM_NAME, NETLIFY_FIELDS, PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'
import { checkEnquiryRelease } from '../scripts/check-enquiry-release.mjs'

const today = '2026-10-24'
const availability = { enabled: true, hostname: 'deploy-preview-3--lifeandleisure.netlify.app', privacyApproved: true }
const valid = () => ({ customer: { fullName: 'Test Traveller', email: 'test@example.com', phone: '', country: '', privacyAcknowledged: true }, serviceType: 'visa', travel: { destination: 'Japan', nationality: 'Indian', purpose: 'Tourism' }, additionalRequirements: '', metadata: { sourcePath: '/visa', clientRequestId: 'synthetic-test' } })

test('required contact, email, optional phone, lengths and privacy are validated', () => {
  assert.deepEqual(validateEnquiry(valid(), today), {})
  for (const [key, value] of [['fullName', ' '], ['fullName', 'a'.repeat(121)], ['email', 'invalid'], ['email', 'a\nb@example.com'], ['phone', '123'], ['phone', 'abc1234567'], ['country', 'x'.repeat(81)], ['privacyAcknowledged', false], ['privacyAcknowledged', 'true']]) {
    const input = valid(); input.customer[key] = value
    assert.ok(validateEnquiry(input, today)[key], key)
  }
  const input = valid(); input.customer.phone = '+91 (98765) 43210'
  assert.deepEqual(validateEnquiry(input, today), {})
  input.additionalRequirements = 'x'.repeat(5001)
  assert.ok(validateEnquiry(input, today).additionalRequirements)
})

test('all seven services require only their own relevant fields', () => {
  const travel = {
    flights: { from: 'Delhi', to: 'Tokyo', tripType: 'One-way', departure: '2027-02-01', passengers: '1', cabin: 'Economy' },
    hotels: { destination: 'Kyoto', checkIn: '2027-02-01', checkOut: '2027-02-02', rooms: '1', guests: '2' },
    trains: { from: 'Delhi', to: 'Jaipur', departure: '2027-02-01', passengers: '2', class: 'AC Chair Car' },
    visa: valid().travel,
    holidays: { destination: 'Bali', month: '2027-02', travellers: '2', budget: '150000', currency: 'INR' },
    tailor_made: { destination: 'Japan', period: 'Spring 2027', travellers: '2' },
    inbound_india: { destination: 'Rajasthan', arrival: '2027-02-01', departure: '2027-02-10', travellers: '2' },
  }
  for (const [service, values] of Object.entries(travel)) {
    assert.deepEqual(validateTravel(service, values, today), {}, service)
    assert.ok(Object.keys(validateTravel(service, {}, today)).length, service)
  }
  assert.ok(validateTravel('booking', {}, today).serviceType)
  assert.ok(validateTravel('tailor_made', { ...travel.tailor_made, budget: '2000' }, today).currency)
  assert.doesNotThrow(() => validateTravel('tailor_made', { budget: {} }, today))
})

test('calendar validity, past dates, chronology, month and passenger bounds', () => {
  assert.equal(isCalendarDate('2027-02-29'), false)
  assert.equal(isCalendarDate('2028-02-29'), true)
  assert.equal(isCalendarDate('2027-04-31'), false)
  const flight = { from: 'Delhi', to: 'Tokyo', tripType: 'Return', departure: '2027-02-01', return: '2027-02-02', passengers: '2', cabin: 'Economy' }
  for (const count of ['0', '-1', '1.5', '21', 'abc']) assert.ok(validateTravel('flights', { ...flight, passengers: count }, today).passengers)
  assert.ok(validateTravel('flights', { ...flight, return: '2027-02-01' }, today).return)
  assert.ok(validateTravel('flights', { ...flight, departure: '2020-01-01' }, today).departure)
  assert.ok(validateTravel('flights', { ...flight, departure: '2027-02-30' }, today).departure)
  assert.ok(validateTravel('inbound_india', { arrival: '2027-02-02', departure: '2027-02-01' }, today).departure)
  const multi = { ...flight, tripType: 'Multi-city', nextFrom: 'Tokyo', nextTo: 'Osaka', nextDeparture: '2027-02-03', extraFlights: 1, leg3From: 'Osaka', leg3To: 'Delhi', leg3Date: '2027-02-04' }
  assert.deepEqual(validateTravel('flights', multi, today), {})
  assert.ok(validateTravel('flights', { ...multi, leg3Date: '2027-02-02' }, today).leg3Date)
})

test('URL encoding, canonical form name, honeypot and allowlisted payload', () => {
  const input = valid(); input.customer.fullName = 'Test & Example'; input.additionalRequirements = 'Kyōto + tea & culture\nTwo people'
  input.travel.status = 'approved'; input.metadata.assignee = 'attacker'; input.status = 'booked'
  const payload = new URLSearchParams(encodeEnquiry(input, 'bot value'))
  assert.deepEqual([...payload.keys()].sort(), [...NETLIFY_FIELDS].sort())
  assert.equal(payload.get('form-name'), ENQUIRY_FORM_NAME)
  assert.equal(payload.get('bot-field'), 'bot value')
  assert.equal(payload.get('customer_name'), input.customer.fullName)
  assert.equal(payload.get('additional_requirements'), input.additionalRequirements)
  assert.equal(payload.get('privacy_acknowledged'), 'yes')
  assert.equal(payload.get('privacy_notice_version'), PRIVACY_NOTICE.version)
  assert.doesNotMatch(payload.get('travel_details'), /status|approved/)
  assert.equal(payload.has('assignee'), false)
})

test('package and India handoff preserves identifiers without contact or staff fields', () => {
  const context = createEnquiryContext('holidays', { destination: 'Bali', travellers: '2', customer: 'private' }, { packageSlug: 'bali-escape', sourcePath: '/packages/bali-escape', destination: 'Bali', experience: 'Leisure', status: 'booked' })
  assert.equal(context.metadata.packageSlug, 'bali-escape')
  assert.equal(context.travel.destination, 'Bali')
  assert.equal(context.travel.customer, undefined)
  assert.equal(context.metadata.status, undefined)
  const payload = new URLSearchParams(encodeEnquiry({ ...valid(), ...context }))
  assert.equal(payload.get('package_slug'), 'bali-escape')
  assert.equal(payload.get('source_path'), '/packages/bali-escape')
  const india = createEnquiryContext('inbound_india', { destination: 'Munsiyari', experiences: 'Himalayan Escapes' }, { experience: 'Himalayan Escapes' })
  assert.equal(india.travel.experiences, 'Himalayan Escapes')
})

test('acceptance states and duplicate-click lock; success only after acceptance', async () => {
  let resolveRequest; let calls = 0; const states = []
  const submit = createEnquirySubmitter({ availability, today, onState: state => states.push(state.status), request: (url, options) => { calls++; assert.equal(url, '/'); assert.equal(options.method, 'POST'); assert.equal(options.headers['Content-Type'], 'application/x-www-form-urlencoded'); return new Promise(resolve => { resolveRequest = resolve }) } })
  const input = valid(); const original = structuredClone(input)
  const pending = submit(input)
  assert.deepEqual(states, ['VALIDATING', 'SUBMITTING'])
  assert.deepEqual(await submit(input), { ignored: true })
  assert.equal(calls, 1)
  resolveRequest({ ok: true })
  assert.equal((await pending).message, SUCCESS_MESSAGE)
  assert.deepEqual(states, ['VALIDATING', 'SUBMITTING', 'SUCCESS'])
  assert.deepEqual(input, original)
  assert.deepEqual(await submit(input), { ignored: true })
})

test('network and provider failures preserve entries and allow manual retry', async () => {
  for (const fail of [async () => { throw new Error('offline') }, async () => ({ ok: false })]) {
    let calls = 0
    const submit = createEnquirySubmitter({ availability, today, request: async (...args) => { calls++; return calls === 1 ? fail(...args) : { ok: true } } })
    const input = valid(); const original = structuredClone(input)
    assert.equal((await submit(input)).message, ERROR_MESSAGE)
    assert.deepEqual(input, original)
    assert.equal((await submit(input)).status, 'SUCCESS')
  }
})

test('invalid enquiries, unapproved privacy, disabled intake and localhost never POST', async () => {
  const configs = [{ ...availability, privacyApproved: false }, { ...availability, enabled: false }, { ...availability, hostname: 'localhost' }]
  for (const config of configs) {
    let calls = 0
    const submit = createEnquirySubmitter({ availability: config, today, request: async () => { calls++; return { ok: true } } })
    assert.equal((await submit(valid())).status, 'ERROR')
    assert.equal(calls, 0)
  }
  const submit = createEnquirySubmitter({ availability, today, request: () => assert.fail('Invalid data must not be submitted') })
  const input = valid(); input.customer.privacyAcknowledged = false
  assert.ok((await submit(input)).errors.privacyAcknowledged)
})

test('source and production build register exactly the submitted fields, and preserve SPA fallback', () => {
  for (const file of ['index.html', 'dist/index.html']) {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    const form = html.match(/<form\b[^>]*name="life-leisure-enquiry"[^>]*>[\s\S]*?<\/form>/)?.[0]
    assert.ok(form, file)
    assert.match(form, /data-netlify="true"/)
    assert.match(form, /netlify-honeypot="bot-field"/)
    const names = [...form.matchAll(/<(?:input|textarea)\b[^>]*name="([^"]+)"/g)].map(match => match[1])
    assert.deepEqual(names.sort(), [...NETLIFY_FIELDS].sort())
  }
  assert.match(readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8'), /\/\*\s+\/index.html\s+200/)
})

test('production build is blocked until business approval and explicit enablement', () => {
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.throws(() => checkEnquiryRelease({ CONTEXT: 'production', VITE_ENQUIRY_INTAKE_ENABLED: 'true' }), /blocked/)
  assert.throws(() => checkEnquiryRelease({ CONTEXT: 'production' }, true), /blocked/)
  assert.doesNotThrow(() => checkEnquiryRelease({ CONTEXT: 'deploy-preview' }))
  assert.doesNotThrow(() => checkEnquiryRelease({ CONTEXT: 'production', VITE_ENQUIRY_INTAKE_ENABLED: 'true' }, true))
  assert.match(readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8'), /node scripts\/check-enquiry-release.mjs && npm run build/)
})
