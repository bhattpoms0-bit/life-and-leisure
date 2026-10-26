import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createEmailEnquiryHandler, MAX_REQUEST_BYTES } from '../netlify/lib/enquiryHandler.mjs'
import deployedHandler, { config } from '../netlify/functions/enquiries.mjs'
import { checkEnquiryRelease } from '../scripts/check-enquiry-release.mjs'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'
import { createEnquirySubmitter, SUCCESS_MESSAGE } from '../src/lib/enquirySubmission.js'
import { isEmail, validateEnquiry } from '../src/lib/enquiryValidation.js'

const origin = 'https://deploy-preview-1--isolated-test.netlify.app'
const siteId = '00000000-0000-4000-8000-000000000001'
const requestId = '00000000-0000-4000-8000-000000000002'
const providerId = '00000000-0000-4000-8000-000000000003'
const clock = new Date('2026-10-25T08:00:00.000Z')
const context = { site: { id: siteId }, deploy: { context: 'deploy-preview' } }
// Placeholder used only by injected mocks; never a live key/configuration.
const env = { EMAIL_ENQUIRY_ENABLED: 'true', EMAIL_ENQUIRY_CONTEXT: 'deploy-preview', EMAIL_ENQUIRY_SITE_ID: siteId, EMAIL_ENQUIRY_ORIGIN: origin, RESEND_FROM_EMAIL: 'notifications@mail.lifeandleisure.travel', EMAIL_ENQUIRY_TO: 'enquiries@lifeandleisure.travel', RESEND_API_KEY: 'offline-mock-only' }
// Fictional adopted notice for injected offline tests only; not business approval.
const notice = { ...PRIVACY_NOTICE, approved: true, version: 'email-first-v999', effectiveDate: '2000-01-01' }
const valid = () => ({ schemaVersion: 1, serviceType: 'visa', customer: { fullName: 'Synthetic Traveller', email: 'synthetic@example.com', phone: '', country: '', privacyAcknowledged: true }, travel: { destination: 'Japan', nationality: 'Indian', purpose: 'Tourism' }, additionalRequirements: '', metadata: { clientRequestId: requestId, submittedAt: clock.toISOString(), sourcePath: '/visa' }, privacyNoticeVersion: notice.version, honeypot: '' })
const request = (body = valid(), options = {}) => new Request(`${origin}/api/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body), ...options })
const accepted = () => Response.json({ id: providerId })
const handler = (options = {}) => createEmailEnquiryHandler({ env, notice, now: () => clock, requestEmail: async () => accepted(), ...options })

test('malformed email local parts, unsupported syntax and header controls never reach the provider', async () => {
  let calls = 0
  const run = handler({ requestEmail: async () => { calls++; return accepted() } })
  const invalid = [
    '.bad@example.com', 'bad.@example.com', 'bad..name@example.com',
    `${'a'.repeat(65)}@example.com`, `${'\u00e9'.repeat(33)}@example.com`,
    'bad@example.com\r\nBcc: attacker@example.com', 'bad@example.com\n',
    'bad\u0000@example.com', 'bad\t@example.com', 'bad\u007f@example.com',
    '"quoted"@example.com', 'Name <name@example.com>', 'a@b@example.com',
    'a b@example.com', 'name@-example.com', `name@${'a'.repeat(64)}.com`,
  ]
  for (const email of invalid) {
    const input = valid(); input.customer.email = email
    assert.equal(isEmail(email), false, JSON.stringify(email))
    assert.ok(validateEnquiry(input, '2026-10-25').email)
    const response = await run(request(input), context)
    assert.equal(response.status, 422, JSON.stringify(email))
    assert.ok((await response.json()).errors.email)
  }
  assert.equal(calls, 0)
})

test('ordinary, plus-addressed and 64-octet emails remain valid customer Reply-To values', async () => {
  for (const email of ['traveller@example.com', 'first.last+holiday@example.co.in', 'Trip+2027@sub.example.com', `${'a'.repeat(64)}@example.com`]) {
    const input = valid(); input.customer.email = email
    assert.equal(isEmail(email), true, email)
    assert.equal(validateEnquiry(input, '2026-10-25').email, undefined)
    let outgoing; let calls = 0
    const response = await handler({ requestEmail: async (_, options) => { calls++; outgoing = JSON.parse(options.body); return accepted() } })(request(input), context)
    assert.equal(response.status, 200, email)
    assert.equal(calls, 1)
    assert.equal(outgoing.reply_to, email)
    assert.deepEqual(outgoing.to, ['enquiries@lifeandleisure.travel'])
  }
})

test('metadata types reject with 422 before provider calls; valid source paths are preserved', async () => {
  let calls = 0
  const run = handler({ requestEmail: async () => { calls++; return accepted() } })
  for (const key of ['sourcePath', 'packageSlug', 'destination', 'experience', 'clientRequestId', 'submittedAt']) {
    for (const value of [42, null, [], ['/contact'], {}, { toString: 'unexpected' }, false]) {
      const input = valid(); input.metadata[key] = value
      const response = await run(request(input), context)
      assert.equal(response.status, 422, `${key}: ${JSON.stringify(value)}`)
      const result = await response.json()
      assert.equal(result.accepted, false)
      assert.ok(result.errors.serviceType)
      assert.doesNotMatch(JSON.stringify(result), /TypeError|startsWith|stack|Resend/)
    }
  }
  for (const metadata of [null, [], 42]) {
    const response = await run(request({ ...valid(), metadata }), context)
    assert.equal(response.status, 422)
  }
  assert.equal(calls, 0)
  const input = valid(); input.metadata.sourcePath = '/packages/bali-escape'
  let outgoing
  const response = await handler({ requestEmail: async (_, options) => { outgoing = JSON.parse(options.body); return accepted() } })(request(input), context)
  assert.equal(response.status, 200)
  assert.ok(outgoing.text.includes(input.metadata.sourcePath))
})

test('deployed function stays disabled even with valid input; no provider calls', async () => {
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal((await deployedHandler(request(), context)).status, 503)
  let calls = 0
  const disabled = handler({ notice: PRIVACY_NOTICE, requestEmail: () => { calls++; assert.fail('Must never send') } })
  assert.equal((await disabled(request(), context)).status, 503)
  assert.equal(calls, 0)
})

test('activation, credentials, sender, recipient and trusted deployment context all fail closed', async () => {
  for (const key of Object.keys(env)) {
    const missing = { ...env }; delete missing[key]
    assert.equal((await handler({ env: missing, requestEmail: () => assert.fail('Missing configuration must not send') })(request(), context)).status, 503, key)
  }
  for (const override of [{ EMAIL_ENQUIRY_ENABLED: 'false' }, { EMAIL_ENQUIRY_TO: 'attacker@example.com' }, { RESEND_FROM_EMAIL: 'from@example.com\r\nBcc:bad@example.com' }, { EMAIL_ENQUIRY_CONTEXT: 'dev' }, { EMAIL_ENQUIRY_ORIGIN: 'http://localhost' }]) assert.equal((await handler({ env: { ...env, ...override } })(request(), context)).status, 503)
  for (const runtime of [{}, { ...context, site: { id: 'wrong' } }, { ...context, deploy: { context: 'production' } }]) assert.equal((await handler()(request(), runtime)).status, 503)
})

test('POST only, exact API path, JSON only and same origin required', async () => {
  const run = handler({ requestEmail: () => assert.fail('Rejected requests must not send') })
  const get = await run(new Request(`${origin}/api/enquiries`), context)
  assert.equal(get.status, 405); assert.equal(get.headers.get('allow'), 'POST')
  assert.equal((await run(new Request(`${origin}/.netlify/functions/enquiries`, { method: 'POST' }), context)).status, 404)
  for (const type of ['text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data']) assert.equal((await run(request(valid(), { headers: { Origin: origin, 'Content-Type': type } }), context)).status, 415)
  for (const badOrigin of ['https://evil.example', 'null', '']) assert.equal((await run(request(valid(), { headers: { Origin: badOrigin, 'Content-Type': 'application/json' } }), context)).status, 403)
  assert.equal((await run(request(valid(), { headers: { Origin: origin, 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' } }), context)).status, 415)
})

test('request byte limits apply with or without Content-Length; malformed JSON rejected', async () => {
  const run = handler({ requestEmail: () => assert.fail('Must not send') })
  assert.equal((await run(request(valid(), { headers: { Origin: origin, 'Content-Type': 'application/json', 'Content-Length': String(MAX_REQUEST_BYTES + 1) } }), context)).status, 413)
  assert.equal((await run(request({ ...valid(), additionalRequirements: '界'.repeat(MAX_REQUEST_BYTES) }), context)).status, 413)
  assert.equal((await run(request(valid(), { body: '{broken' }), context)).status, 400)
  for (const body of [null, [], 'text', { ...valid(), recipient: 'attacker@example.com' }, { ...valid(), customer: null }, { ...valid(), travel: [] }]) assert.equal((await run(request(body), context)).status, 422)
})

test('all eight service schemas send only relevant fields through mocked Resend', async () => {
  const samples = {
    flights: { from: 'Delhi', to: 'Tokyo', tripType: 'One-way', departure: '2027-02-01', passengers: '2', cabin: 'Economy' },
    hotels: { destination: 'Kyoto', checkIn: '2027-02-01', checkOut: '2027-02-02', rooms: '1', guests: '2' },
    trains: { from: 'Delhi', to: 'Jaipur', departure: '2027-02-01', passengers: '2', class: 'AC Chair Car' },
    visa: valid().travel,
    holidays: { destination: 'Bali', month: '2027-02', travellers: '2', budget: '150000', currency: 'INR' },
    tailor_made: { destination: 'Japan', period: 'Spring 2027', travellers: '2' },
    inbound_india: { destination: 'Rajasthan', arrival: '2027-02-01', departure: '2027-02-10', travellers: '2' },
    travel_consultation: { topic: 'Compare travel options' },
  }
  for (const [serviceType, travel] of Object.entries(samples)) {
    let outgoing
    const response = await handler({ requestEmail: async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); outgoing = JSON.parse(options.body); return accepted() } })(request({ ...valid(), serviceType, travel }), context)
    assert.equal(response.status, 200, serviceType)
    assert.equal((await response.json()).accepted, true)
    assert.ok(outgoing.html && outgoing.text)
    assert.match(outgoing.text, /This is a travel enquiry, not a confirmed booking/)
    assert.doesNotMatch(outgoing.text, /Phone:|Country of residence:/)
    assert.equal(outgoing.reply_to, 'synthetic@example.com')
    assert.deepEqual(outgoing.to, ['enquiries@lifeandleisure.travel'])
  }
})

test('required fields, injection attempts, spam, dates, counts and notice version reject before send', async () => {
  const cases = [
    input => { input.serviceType = 'invalid' },
    input => { input.customer.fullName = '' },
    input => { input.customer.fullName = 'x'.repeat(121) },
    input => { input.customer.email = 'bad' },
    input => { input.customer.email = 'a@example.com\r\nBcc: attacker@example.com' },
    input => { input.customer.email = 'a@example.com\n' },
    input => { input.customer.privacyAcknowledged = false },
    input => { input.customer.privacyAcknowledged = 'true' },
    input => { input.customer.phone = 0 },
    input => { input.privacyNoticeVersion = 'old' },
    input => { input.honeypot = 'bot' },
    input => { input.metadata.sourcePath = 'https://evil.example' },
    input => { input.metadata.experience = 'x\r\nBcc:y' },
    input => { input.metadata.clientRequestId = 'bad' },
    input => { input.metadata.submittedAt = '2020-01-01T00:00:00.000Z' },
    input => { input.additionalRequirements = 'x'.repeat(5001) },
    input => { input.travel.status = 'booked' },
    input => { input.serviceType = 'flights'; input.travel = { from: 'Delhi', to: 'Tokyo', tripType: 'One-way', departure: '2027-02-30', passengers: '0', cabin: 'Economy' } },
    input => { input.serviceType = 'hotels'; input.travel = { destination: 'Kyoto', checkIn: '2027-02-02', checkOut: '2027-02-01', rooms: '1', guests: '2' } },
    input => { input.serviceType = 'flights'; input.travel = { from: 'Delhi', to: 'Tokyo', tripType: 'Multi-city', departure: '2027-02-01', passengers: '2', cabin: 'Economy', extraFlights: 99 } },
  ]
  const run = handler({ requestEmail: () => assert.fail('Invalid data must not send') })
  for (const alter of cases) { const input = valid(); alter(input); assert.equal((await run(request(input), context)).status, 422, alter.toString()) }
})

test('HTML is escaped, subject is enum-derived, Reply-To is validated, reference/context included', async () => {
  const input = valid()
  input.customer.fullName = '<img src=x onerror=alert(1)>'
  input.additionalRequirements = '<script>alert(1)</script>\nTea & culture'
  input.serviceType = 'holidays'
  input.travel = { destination: 'Bali', month: '2027-02', travellers: '2', budget: 'Please advise', currency: 'INR' }
  input.metadata.packageSlug = 'bali-escape'; input.metadata.experience = 'Signature escape'
  let outgoing
  const response = await handler({ requestEmail: async (_, options) => { outgoing = JSON.parse(options.body); return accepted() } })(request(input), context)
  assert.equal(response.status, 200)
  assert.doesNotMatch(outgoing.html, /<script>|<img src=x/)
  assert.match(outgoing.html, /&lt;script&gt;/)
  assert.match(outgoing.text, /<script>/)
  assert.match(outgoing.text, /bali-escape|Signature escape/)
  assert.ok(outgoing.text.includes(notice.version))
  assert.ok(outgoing.text.includes(requestId))
  assert.doesNotMatch(outgoing.subject, /[\r\n<>]/)
})

test('identical retries use stable provider idempotency, changed data uses a different key', async () => {
  const keys = []
  const run = handler({ requestEmail: async (_, options) => { keys.push(options.headers['Idempotency-Key']); return accepted() } })
  await run(request(), context); await run(request(), context)
  const changed = valid(); changed.additionalRequirements = 'Another preference'
  await run(request(changed), context)
  assert.equal(keys[0], keys[1]); assert.notEqual(keys[1], keys[2])
})

test('provider errors, invalid acceptance and exceptions never leak PII or get logged', async () => {
  const calls = []; const originals = [console.log, console.error, console.warn]
  console.log = console.error = console.warn = (...args) => calls.push(args)
  try {
    for (const provider of [async () => Response.json({ message: 'synthetic@example.com private provider data' }, { status: 429 }), async () => Response.json({}), async () => { throw new Error('synthetic@example.com secret') }]) {
      const response = await handler({ requestEmail: provider })(request(), context)
      assert.equal(response.status, 502)
      assert.doesNotMatch(await response.text(), /synthetic@example.com|secret|private provider data/)
    }
    assert.deepEqual(calls, [])
  } finally { [console.log, console.error, console.warn] = originals }
})

test('React transport integrates with mock server; no success from an HTML/unknown response', async () => {
  const availability = { enabled: true, hostname: new URL(origin).hostname, previewSiteName: 'isolated-test', privacyApproved: true }
  const input = valid()
  const submit = createEnquirySubmitter({ availability, today: '2026-10-25', request: async (url, options) => { assert.equal(url, '/api/enquiries'); const payload = JSON.parse(options.body); assert.equal(payload.privacyNoticeVersion, PRIVACY_NOTICE.version); payload.privacyNoticeVersion = notice.version; return handler()(new Request(origin + url, { ...options, body: JSON.stringify(payload), headers: { ...options.headers, Origin: origin } }), context) } })
  const result = await submit(input)
  assert.equal(result.status, 'SUCCESS'); assert.equal(result.message, SUCCESS_MESSAGE)
  assert.match(result.message, /does not confirm delivery/)
  const invalid = createEnquirySubmitter({ availability, request: async () => new Response('<html>SPA fallback</html>') })
  assert.equal((await invalid(input)).status, 'ERROR')
  const serverErrors = createEnquirySubmitter({ availability, request: async () => Response.json({ accepted: false, errors: { email: 'Review email.' } }, { status: 422 }) })
  assert.equal((await serverErrors(input)).errors.email, 'Review email.')
})

test('rate limit declaration, function routing and production guard remain fail closed', () => {
  assert.equal(config.path, '/api/enquiries')
  assert.deepEqual(config.rateLimit, { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] })
  assert.match(readFileSync('netlify.toml', 'utf8'), /directory = "netlify\/functions"/)
  assert.throws(() => checkEnquiryRelease({ CONTEXT: 'production', ...env }), /blocked/)
  const production = { ...env, EMAIL_ENQUIRY_CONTEXT: 'production', EMAIL_ENQUIRY_ORIGIN: 'https://lifeandleisure.travel', CONTEXT: 'production', SITE_ID: siteId, VITE_ENQUIRY_INTAKE_ENABLED: 'true' }
  assert.throws(() => checkEnquiryRelease(production), /blocked/)
  assert.doesNotThrow(() => checkEnquiryRelease(production, notice, clock))
})
