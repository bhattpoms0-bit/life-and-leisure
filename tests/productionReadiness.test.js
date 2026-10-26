import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { PRIVACY_NOTICE, intakeAvailability } from '../src/data/enquiryConfig.js'
import { isPrivacyAdopted } from '../src/lib/privacyAdoption.js'
import { getEmailConfiguration, ENQUIRY_SENDER } from '../netlify/lib/emailConfiguration.mjs'
import { checkEnquiryRelease } from '../scripts/check-enquiry-release.mjs'
import deployedHandler, { config } from '../netlify/functions/enquiries.mjs'
import { createEmailEnquiryHandler } from '../netlify/lib/enquiryHandler.mjs'

const clock = new Date('2026-10-26T09:00:00.000Z')
// Fictional injected adoption/configuration for offline tests only. These values
// do not approve the source policy, assign its date, or activate a deployment.
const adopted = { ...PRIVACY_NOTICE, approved: true, version: 'email-first-v999', effectiveDate: '2000-01-01' }
const siteId = '00000000-0000-4000-8000-000000000001'
const origin = 'https://lifeandleisure.travel'
const env = {
  CONTEXT: 'production', SITE_ID: siteId, EMAIL_ENQUIRY_SITE_ID: siteId,
  EMAIL_ENQUIRY_CONTEXT: 'production', EMAIL_ENQUIRY_ORIGIN: origin,
  EMAIL_ENQUIRY_ENABLED: 'true', VITE_ENQUIRY_INTAKE_ENABLED: 'true',
  RESEND_API_KEY: 'offline-mock-only', RESEND_FROM_EMAIL: ENQUIRY_SENDER,
  EMAIL_ENQUIRY_TO: 'enquiries@lifeandleisure.travel',
}
const runtime = { site: { id: siteId }, deploy: { context: 'production' } }
const payload = () => ({
  schemaVersion: 1, serviceType: 'travel_consultation',
  customer: { fullName: 'Fictional Release Traveller', email: 'fictional@example.com', phone: '', country: '', privacyAcknowledged: true },
  travel: { topic: 'Fictional itinerary review' }, additionalRequirements: '',
  metadata: { clientRequestId: '00000000-0000-4000-8000-000000000002', submittedAt: clock.toISOString(), sourcePath: '/services' },
  privacyNoticeVersion: adopted.version, honeypot: '',
})
const request = body => new Request(origin + '/api/enquiries', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? payload()) })
const invalidNotices = [
  null, undefined, true, [], {}, PRIVACY_NOTICE,
  { ...adopted, approved: false }, { ...adopted, approved: 'true' }, { ...adopted, approved: 1 },
  { ...adopted, approved: undefined }, { ...adopted, version: undefined },
  ...[null, [], {}, 42, false, '', 'email-first-draft-1', 'email-first-preview-1', 'email-first-test-1', 'email-first-v0', 'email-first-v01', ' email-first-v1', 'email-first-v1\n', 'v1', 'x'.repeat(81)].map(version => ({ ...adopted, version })),
  ...[undefined, null, [], {}, 42, '', '2026-02-30', '2026-13-01', '2026-1-01', '2026-10-26T00:00:00Z', '2026-10-26\n', '2027-01-01'].map(effectiveDate => ({ ...adopted, effectiveDate })),
]

test('source privacy remains an unapproved draft with no effective date and cannot enable intake', () => {
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal(PRIVACY_NOTICE.version, 'email-first-draft-1')
  assert.equal(PRIVACY_NOTICE.effectiveDate, null)
  assert.equal(isPrivacyAdopted(PRIVACY_NOTICE, clock), false)
  assert.equal(getEmailConfiguration(env), null)
  assert.notEqual(intakeAvailability({ enabled: true, hostname: 'lifeandleisure.travel' }), '')
  assert.throws(() => checkEnquiryRelease(env), /blocked/)
})

test('build and runtime agree: malformed, missing, draft and future-dated adoption fail closed', async () => {
  let providerCalls = 0
  for (const notice of invalidNotices) {
    assert.equal(isPrivacyAdopted(notice, clock), false)
    assert.equal(getEmailConfiguration(env, notice, clock), null)
    assert.throws(() => checkEnquiryRelease(env, notice, clock), /blocked/)
    const handler = createEmailEnquiryHandler({ env, notice, now: () => clock, requestEmail: () => { providerCalls++; assert.fail('Invalid adoption must not send') } })
    assert.equal((await handler(request(), runtime)).status, 503)
  }
  assert.equal(providerCalls, 0)
})

test('adoption dates are calendar-valid and effective by the India date, consistently at both gates', () => {
  assert.equal(isPrivacyAdopted({ ...adopted, effectiveDate: '2000-02-29' }, clock), true)
  assert.equal(isPrivacyAdopted({ ...adopted, effectiveDate: '2001-02-29' }, clock), false)
  const midnight = { ...adopted, effectiveDate: '2026-10-27' }
  const before = new Date('2026-10-26T18:29:59Z'), after = new Date('2026-10-26T18:30:00Z')
  assert.equal(isPrivacyAdopted(midnight, before), false)
  assert.equal(isPrivacyAdopted(midnight, after), true)
  assert.equal(getEmailConfiguration(env, midnight, before), null)
  assert.throws(() => checkEnquiryRelease(env, midnight, before), /blocked/)
  assert.ok(getEmailConfiguration(env, midnight, after))
  assert.doesNotThrow(() => checkEnquiryRelease(env, midnight, after))
  assert.equal(isPrivacyAdopted(adopted, new Date('invalid')), false)
})

test('sender is pinned to the approved subdomain address and recipient remains fixed at both gates', async () => {
  assert.equal(ENQUIRY_SENDER, 'notifications@mail.lifeandleisure.travel')
  for (const override of [
    { RESEND_FROM_EMAIL: 'sender@example.com' },
    { RESEND_FROM_EMAIL: 'other@mail.lifeandleisure.travel' },
    { RESEND_FROM_EMAIL: 'notifications@lifeandleisure.travel' },
    { RESEND_FROM_EMAIL: 'notifications@mail.lifeandleisure.travel.evil.example' },
    { RESEND_FROM_EMAIL: `${ENQUIRY_SENDER}\r\nBcc: attacker@example.com` },
    { EMAIL_ENQUIRY_TO: 'attacker@example.com' },
  ]) {
    const settings = { ...env, ...override }
    assert.equal(getEmailConfiguration(settings, adopted, clock), null)
    assert.throws(() => checkEnquiryRelease(settings, adopted, clock), /blocked/)
    const handler = createEmailEnquiryHandler({ env: settings, notice: adopted, now: () => clock, requestEmail: () => assert.fail('Invalid sender/recipient must not send') })
    assert.equal((await handler(request(), runtime)).status, 503)
  }
})

test('adopted offline fixture still requires credentials, activation, matching site/context and frontend build flag', async () => {
  for (const key of ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'EMAIL_ENQUIRY_TO', 'EMAIL_ENQUIRY_ENABLED', 'EMAIL_ENQUIRY_SITE_ID', 'EMAIL_ENQUIRY_CONTEXT', 'EMAIL_ENQUIRY_ORIGIN']) {
    const settings = { ...env }; delete settings[key]
    assert.equal(getEmailConfiguration(settings, adopted, clock), null)
    assert.throws(() => checkEnquiryRelease(settings, adopted, clock), /blocked/)
  }
  for (const override of [{ SITE_ID: 'wrong' }, { VITE_ENQUIRY_INTAKE_ENABLED: 'false' }]) assert.throws(() => checkEnquiryRelease({ ...env, ...override }, adopted, clock), /blocked/)
  const handler = createEmailEnquiryHandler({ env, notice: adopted, now: () => clock, requestEmail: () => assert.fail('Wrong trusted runtime must not send') })
  for (const context of [{}, { ...runtime, site: { id: 'wrong' } }, { ...runtime, deploy: { context: 'deploy-preview' } }]) assert.equal((await handler(request(), context)).status, 503)
})

test('valid offline adoption permits only validated mocked delivery and rejects stale notice acknowledgement', async () => {
  assert.doesNotThrow(() => checkEnquiryRelease(env, adopted, clock))
  let calls = 0, outgoing
  const handler = createEmailEnquiryHandler({ env, notice: adopted, now: () => clock, requestEmail: async (url, options) => {
    calls++; assert.equal(url, 'https://api.resend.com/emails'); outgoing = JSON.parse(options.body)
    return Response.json({ id: '00000000-0000-4000-8000-000000000003' })
  } })
  const stale = payload(); stale.privacyNoticeVersion = PRIVACY_NOTICE.version
  assert.equal((await handler(request(stale), runtime)).status, 422)
  const unchecked = payload(); unchecked.customer.privacyAcknowledged = false
  assert.equal((await handler(request(unchecked), runtime)).status, 422)
  assert.equal(calls, 0)
  assert.equal((await handler(request(), runtime)).status, 200)
  assert.equal(calls, 1)
  assert.equal(outgoing.from, `Life & Leisure Travel <${ENQUIRY_SENDER}>`)
  assert.deepEqual(outgoing.to, ['enquiries@lifeandleisure.travel'])
  assert.equal(outgoing.reply_to, 'fictional@example.com')
  assert.ok(outgoing.html && outgoing.text)
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal(PRIVACY_NOTICE.effectiveDate, null)
})

test('production guard CLI blocks current source while preview guard passes and normal endpoint defaults to 503', async () => {
  const production = spawnSync(process.execPath, ['scripts/check-enquiry-release.mjs'], { env: { ...process.env, ...env }, encoding: 'utf8' })
  assert.equal(production.status, 1)
  assert.match(production.stderr, /production release blocked/)
  const preview = spawnSync(process.execPath, ['scripts/check-enquiry-release.mjs'], { env: { ...process.env, CONTEXT: 'deploy-preview' }, encoding: 'utf8' })
  assert.equal(preview.status, 0)
  assert.equal((await deployedHandler(request(), runtime)).status, 503)
})

test('intended release has only the normal function and no temporary route, authorization module or deployment configuration', () => {
  assert.deepEqual(readdirSync('netlify/functions').sort(), ['enquiries.mjs'])
  for (const path of ['netlify/functions/preview-enquiry-verification.mjs', 'netlify/lib/previewEnquiryTest.mjs', 'netlify/lib/previewTestAuthorization.mjs', 'docs/PREVIEW_EMAIL_TEST.md']) assert.equal(existsSync(path), false, path)
  for (const path of ['netlify.toml', 'public/_redirects', 'src/App.jsx', 'src/pages/Contact.jsx', 'netlify/lib/enquiryHandler.mjs']) assert.doesNotMatch(readFileSync(path, 'utf8'), /PREVIEW_EMAIL_TEST|preview-enquiry-test|previewEnquiryTest|previewTestAuthorization/)
  const handler = readFileSync('netlify/lib/enquiryHandler.mjs', 'utf8')
  assert.match(handler, /async function boundedJson/)
  assert.doesNotMatch(handler, /export async function boundedJson/)
  assert.equal(config.path, '/api/enquiries')
  assert.deepEqual(config.rateLimit, { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] })
})
