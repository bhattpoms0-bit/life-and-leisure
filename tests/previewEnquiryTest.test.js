import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'
import deployedPreview, { config } from '../netlify/functions/preview-enquiry-verification.mjs'
import deployedNormal from '../netlify/functions/enquiries.mjs'
import { createPreviewEnquiryTestHandler, PREVIEW_TEST_FROM, PREVIEW_TEST_TO, PREVIEW_TEST_SUBJECT, SYNTHETIC_PREVIEW_ENQUIRY } from '../netlify/lib/previewEnquiryTest.mjs'
import { PREVIEW_TEST_SITE_ID, PREVIEW_TEST_ORIGIN, PREVIEW_TEST_ENDPOINT, PREVIEW_FIXTURE_ID, previewTestSettings } from '../netlify/lib/previewTestAuthorization.mjs'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'
import { checkEnquiryRelease } from '../scripts/check-enquiry-release.mjs'

// Offline mock signing key, deploy identity and provider key only. Never live credentials.
const signingSecret = Buffer.alloc(32, 7).toString('hex')
const deployId = '000000000000000000000001'
const clock = new Date('2026-10-25T08:01:00.000Z')
const issuedAt = Math.floor(clock.getTime() / 1000)
const context = { site: { id: PREVIEW_TEST_SITE_ID }, deploy: { id: deployId, context: 'deploy-preview', published: false } }
const env = {
  PREVIEW_EMAIL_TEST_ENABLED: 'true', EMAIL_ENQUIRY_ENABLED: 'false',
  PREVIEW_EMAIL_TEST_SITE_ID: PREVIEW_TEST_SITE_ID, PREVIEW_EMAIL_TEST_ORIGIN: PREVIEW_TEST_ORIGIN,
  PREVIEW_EMAIL_TEST_AUTH_SECRET: signingSecret, PREVIEW_EMAIL_TEST_RESEND_API_KEY: 'offline-provider-mock',
}
const claims = () => ({ version: 1, siteId: PREVIEW_TEST_SITE_ID, deployId, origin: PREVIEW_TEST_ORIGIN, issuedAt, expiresAt: issuedAt + 900, fixtureId: PREVIEW_FIXTURE_ID, noticeVersion: PRIVACY_NOTICE.version })
const signEncoded = (encoded, secret = signingSecret) => `${encoded}.${createHmac('sha256', Buffer.from(secret, 'hex')).update(encoded).digest('hex')}`
const sign = (value = claims(), secret) => signEncoded(Buffer.from(JSON.stringify(value)).toString('base64url'), secret)
const envelope = () => ({ fixtureId: PREVIEW_FIXTURE_ID, syntheticAcknowledged: true, privacyNoticeVersion: PRIVACY_NOTICE.version, honeypot: '' })
const request = (payload = envelope(), options = {}) => new Request(PREVIEW_TEST_ORIGIN + PREVIEW_TEST_ENDPOINT, {
  method: 'POST', headers: { Origin: PREVIEW_TEST_ORIGIN, 'Content-Type': 'application/json', Authorization: `Bearer ${sign()}` }, body: JSON.stringify(payload), ...options,
})
const providerAccepted = () => Response.json({ id: '00000000-0000-4000-8000-000000000002' })
const handler = (options = {}) => createPreviewEnquiryTestHandler({ env, now: () => clock, requestEmail: async () => assert.fail('Rejected requests must not call provider'), ...options })

test('preview endpoint is disabled by default, without any activation or credentials', async () => {
  assert.equal((await deployedPreview(request(), context)).status, 503)
  assert.equal((await handler({ env: {} })(request(), context)).status, 503)
  assert.equal(previewTestSettings({}, context), null)
})

test('every required preview variable is fail closed when absent or invalid', async () => {
  for (const key of Object.keys(env)) {
    const missing = { ...env }; delete missing[key]
    assert.equal((await handler({ env: missing })(request(), context)).status, 503, key)
  }
  for (const override of [
    { PREVIEW_EMAIL_TEST_ENABLED: 'false' }, { EMAIL_ENQUIRY_ENABLED: 'true' },
    { PREVIEW_EMAIL_TEST_AUTH_SECRET: 'short' }, { PREVIEW_EMAIL_TEST_AUTH_SECRET: 'g'.repeat(64) },
    { PREVIEW_EMAIL_TEST_RESEND_API_KEY: '' }, { PREVIEW_EMAIL_TEST_RESEND_API_KEY: 'invalid key' },
    { PREVIEW_EMAIL_TEST_SITE_ID: 'wrong' }, { PREVIEW_EMAIL_TEST_ORIGIN: 'https://lifeandleisure.travel' },
  ]) assert.equal((await handler({ env: { ...env, ...override } })(request(), context)).status, 503)
})

test('production always rejects even with all activation variables and a signed production permit', async () => {
  const runtime = { ...context, deploy: { ...context.deploy, context: 'production' } }
  const input = request(envelope(), { headers: { Origin: PREVIEW_TEST_ORIGIN, 'Content-Type': 'application/json', Authorization: `Bearer ${sign({ ...claims(), context: 'production' })}` } })
  assert.equal((await handler({ env: { ...env, CONTEXT: 'deploy-preview', EMAIL_ENQUIRY_CONTEXT: 'production', VITE_ENQUIRY_INTAKE_ENABLED: 'true' } })(input, runtime)).status, 503)
  assert.equal((await handler()(request(), { ...context, deploy: { ...context.deploy, published: true } })).status, 503)
})

test('branch-deploy, dev, missing and incomplete trusted runtime contexts reject', async () => {
  for (const name of ['branch-deploy', 'dev', '', 'production']) assert.equal((await handler()(request(), { ...context, deploy: { ...context.deploy, context: name } })).status, 503)
  for (const runtime of [{}, { site: context.site }, { ...context, deploy: { id: deployId, context: 'deploy-preview' } }, { ...context, deploy: { ...context.deploy, id: '' } }]) assert.equal((await handler()(request(), runtime)).status, 503)
})

test('site and deploy identifiers must match both trusted context and the signed permit', async () => {
  assert.equal((await handler()(request(), { ...context, site: { id: 'wrong' } })).status, 503)
  assert.equal((await handler()(request(), { ...context, deploy: { ...context.deploy, id: '000000000000000000000003' } })).status, 403)
  for (const override of [{ siteId: 'wrong' }, { deployId: '000000000000000000000003' }, { origin: 'https://lifeandleisure.travel' }, { fixtureId: 'other' }, { noticeVersion: 'old' }, { version: 2 }, { extra: 'unapproved' }]) {
    const headers = { Origin: PREVIEW_TEST_ORIGIN, 'Content-Type': 'application/json', Authorization: `Bearer ${sign({ ...claims(), ...override })}` }
    assert.equal((await handler()(request(envelope(), { headers }), context)).status, 403)
  }
})

test('missing, wrong-key, modified and malformed bearer permits are safely rejected', async () => {
  const missing = request(); missing.headers.delete('Authorization')
  assert.equal((await handler()(missing, context)).status, 403)
  for (const authorization of [
    '', 'Basic invalid', 'Bearer invalid', `Bearer ${sign(claims(), Buffer.alloc(32, 8).toString('hex'))}`,
    `Bearer ${sign().slice(0, -1)}z`, `Bearer ${sign()}.extra`, `Bearer ${'a'.repeat(2048)}`,
    `Bearer ${signEncoded(Buffer.from('{broken').toString('base64url'))}`,
    `Bearer ${signEncoded(Buffer.from([255, 254]).toString('base64url'))}`,
    `Bearer ${sign(null)}`, `Bearer ${sign([])}`, `Bearer ${sign({})}`,
  ]) {
    const req = request(); req.headers.set('Authorization', authorization)
    assert.equal((await handler()(req, context)).status, 403)
  }
  // Altering a signed payload without recomputing its MAC must fail.
  const [encoded, signature] = sign().split('.')
  const tampered = Buffer.from(JSON.stringify({ ...claims(), expiresAt: issuedAt + 899 })).toString('base64url')
  assert.notEqual(encoded, tampered)
  const req = request(); req.headers.set('Authorization', `Bearer ${tampered}.${signature}`)
  assert.equal((await handler()(req, context)).status, 403)
})

test('signed permits have an enforced maximum 15-minute server-side window', async () => {
  for (const override of [
    { expiresAt: issuedAt }, { expiresAt: issuedAt - 1 }, { expiresAt: issuedAt + 901 },
    { issuedAt: issuedAt + 1 }, { expiresAt: String(issuedAt + 900) }, { issuedAt: issuedAt + 0.5 },
  ]) {
    const req = request(); req.headers.set('Authorization', `Bearer ${sign({ ...claims(), ...override })}`)
    assert.equal((await handler()(req, context)).status, 403)
  }
  assert.equal((await handler({ now: () => new Date((issuedAt + 900) * 1000) })(request(), context)).status, 403)
  let clocks = 0
  assert.equal((await handler({ now: () => clocks++ === 0 ? clock : new Date((issuedAt + 900) * 1000) })(request(), context)).status, 403, 'Expiry after reading the body must prevent sending')
  clocks = 0
  assert.equal((await handler({ now: () => clocks++ < 2 ? clock : new Date((issuedAt + 900) * 1000) })(request(), context)).status, 403, 'Expiry immediately before the provider call must prevent sending')
})

test('wrong host, Origin or cross-site request is rejected; Origin is not authentication', async () => {
  const wrongHost = new Request('https://lifeandleisure.travel' + PREVIEW_TEST_ENDPOINT, { method: 'POST' })
  assert.equal((await handler()(wrongHost, context)).status, 403)
  for (const origin of ['', 'null', 'https://evil.example']) {
    const req = request(); req.headers.set('Origin', origin)
    assert.equal((await handler()(req, context)).status, 403)
  }
  const cross = request(); cross.headers.set('Sec-Fetch-Site', 'cross-site')
  assert.equal((await handler()(cross, context)).status, 403)
  const spoof = request(); spoof.headers.delete('Authorization')
  assert.equal((await handler()(spoof, context)).status, 403, 'Correct Origin without a permit cannot authorize')
})

test('only the fixed synthetic envelope is accepted; no customer data, sender or recipient fields', async () => {
  for (const input of [
    null, [], { ...envelope(), customer: { email: 'synthetic@example.com' } },
    { ...envelope(), to: 'attacker@example.com' }, { ...envelope(), from: 'attacker@example.com' },
    { ...envelope(), reply_to: 'attacker@example.com' }, { ...envelope(), message: 'unapproved' },
    { ...envelope(), fixtureId: 'other' }, { ...envelope(), syntheticAcknowledged: false },
    { ...envelope(), syntheticAcknowledged: 'true' }, { ...envelope(), privacyNoticeVersion: 'old' },
    { ...envelope(), honeypot: 'bot' },
  ]) assert.equal((await handler()(request(input), context)).status, 422)
  assert.equal(Object.isFrozen(SYNTHETIC_PREVIEW_ENQUIRY), true)
  assert.equal(Object.isFrozen(SYNTHETIC_PREVIEW_ENQUIRY.customer), true)
  assert.equal(Object.isFrozen(SYNTHETIC_PREVIEW_ENQUIRY.travel), true)
})

test('bounded JSON, POST-only methods, dedicated routing and encoding restrictions remain enforced', async () => {
  const get = await handler()(new Request(PREVIEW_TEST_ORIGIN + PREVIEW_TEST_ENDPOINT), context)
  assert.equal(get.status, 405); assert.equal(get.headers.get('Allow'), 'POST')
  assert.equal((await handler()(new Request(PREVIEW_TEST_ORIGIN + '/.netlify/functions/preview-enquiry-verification', { method: 'POST' }), context)).status, 404)
  for (const type of ['text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data']) {
    const req = request(); req.headers.set('Content-Type', type)
    assert.equal((await handler()(req, context)).status, 415)
  }
  const compressed = request(); compressed.headers.set('Content-Encoding', 'gzip')
  assert.equal((await handler()(compressed, context)).status, 415)
  assert.equal((await handler()(request({}, { body: '{broken' }), context)).status, 400)
  assert.equal((await handler()(request({}, { body: 'x'.repeat(25000) }), context)).status, 413)
  const declared = request(); declared.headers.set('Content-Length', '25000')
  assert.equal((await handler()(declared, context)).status, 413)
})

test('one authorized fixture reaches only the mocked provider with fixed headers and safe acceptance wording', async () => {
  let calls = 0; let outgoing
  const run = handler({ requestEmail: async (url, options) => {
    calls++; assert.equal(url, 'https://api.resend.com/emails'); assert.equal(options.redirect, 'error')
    outgoing = JSON.parse(options.body)
    return providerAccepted()
  } })
  const response = await run(request(), context)
  assert.equal(response.status, 200); const data = await response.json(); assert.equal(data.accepted, true)
  assert.equal(calls, 1)
  assert.equal(outgoing.from, `Life & Leisure Travel <${PREVIEW_TEST_FROM}>`)
  assert.deepEqual(outgoing.to, [PREVIEW_TEST_TO]); assert.equal(outgoing.reply_to, PREVIEW_TEST_TO)
  assert.equal(outgoing.subject, PREVIEW_TEST_SUBJECT)
  assert.match(outgoing.text, /SYNTHETIC DATA ONLY/); assert.match(outgoing.html, /SYNTHETIC DATA ONLY/)
  assert.match(outgoing.text, /not policy approval/); assert.match(outgoing.text, /Fictional/)
  assert.ok(outgoing.text.includes(deployId))
  assert.match(data.message, /Inbox delivery is not confirmed/)
  assert.equal(outgoing.cc, undefined); assert.equal(outgoing.bcc, undefined); assert.equal(outgoing.attachments, undefined)
})

test('duplicate requests coalesce in a warm instance and use stable provider idempotency across instances/permits', async () => {
  let calls = 0; let key; let body
  const provider = async (_, options) => {
    calls++; key ??= options.headers['Idempotency-Key']; body ??= options.body
    assert.equal(options.headers['Idempotency-Key'], key); assert.equal(options.body, body)
    return providerAccepted()
  }
  const run = handler({ requestEmail: provider })
  const results = await Promise.all([run(request(), context), run(request(), context)])
  assert.equal(calls, 1); for (const response of results) assert.equal(response.status, 200)
  assert.equal((await run(request(), context)).status, 200); assert.equal(calls, 1)
  const renewed = request(); renewed.headers.set('Authorization', `Bearer ${sign({ ...claims(), issuedAt: issuedAt - 1, expiresAt: issuedAt + 899 })}`)
  await handler({ requestEmail: provider })(renewed, context)
  assert.equal(calls, 2, 'Another runtime can call provider, relying on its bounded idempotency')
  assert.match(key, /^preview\/[a-f0-9]{64}$/)
})

test('provider errors and malformed acceptance never leak credentials, permits, fixture contents or logs', async () => {
  const logs = []; const originals = [console.log, console.warn, console.error]
  console.log = console.warn = console.error = (...args) => logs.push(args)
  try {
    for (const provider of [
      async () => Response.json({ detail: signingSecret, token: sign() }, { status: 429 }),
      async () => Response.json({}), async () => { throw Error(sign()) },
    ]) {
      const response = await handler({ requestEmail: provider })(request(), context)
      assert.equal(response.status, 502)
      const text = await response.text()
      for (const secret of [signingSecret, sign(), env.PREVIEW_EMAIL_TEST_RESEND_API_KEY, SYNTHETIC_PREVIEW_ENQUIRY.customer.fullName]) assert.ok(!text.includes(secret))
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
    }
    assert.deepEqual(logs, [])
  } finally { [console.log, console.warn, console.error] = originals }
})

test('expiry still blocks cached acceptance, and production customer intake remains disabled', async () => {
  let time = clock; let calls = 0
  const run = handler({ now: () => time, requestEmail: async () => { calls++; return providerAccepted() } })
  assert.equal((await run(request(), context)).status, 200)
  time = new Date((issuedAt + 900) * 1000)
  assert.equal((await run(request(), context)).status, 403); assert.equal(calls, 1)
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal((await deployedNormal(new Request('https://lifeandleisure.travel/api/enquiries', { method: 'POST' }), context)).status, 503)
  assert.throws(() => checkEnquiryRelease({ ...env, CONTEXT: 'production' }), /blocked/)
})

test('preview routing/rate limit is declared without altering the customer UI or build guard', () => {
  assert.equal(config.path, PREVIEW_TEST_ENDPOINT)
  assert.deepEqual(config.rateLimit, { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] })
  assert.doesNotMatch(readFileSync('src/pages/Contact.jsx', 'utf8'), /previewEnquiryTest|PREVIEW_EMAIL_TEST/)
  assert.match(readFileSync('netlify.toml', 'utf8'), /node scripts\/check-enquiry-release.mjs && npm run build/)
})
