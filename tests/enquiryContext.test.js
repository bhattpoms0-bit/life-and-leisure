import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { createEnquiryContext, genericEnquiryContext, packageEnquiryContext, switchEnquiryService, getServiceFields, ENQUIRY_CTAS, GROUP_PREFERENCE } from '../src/lib/serviceEnquiry.js'
import { encodeEnquiry, validateEnquiry } from '../src/lib/enquirySubmission.js'
import { createEmailEnquiryHandler } from '../netlify/lib/enquiryHandler.mjs'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'

// Offline dependencies only; no real provider request or runtime activation.
const origin = 'https://deploy-preview-4--lifeandleisure.netlify.app'
const siteId = '00000000-0000-4000-8000-000000000001'
const clock = new Date('2026-10-26T09:00:00.000Z')
const runtime = { site: { id: siteId }, deploy: { context: 'deploy-preview' } }
const env = { EMAIL_ENQUIRY_ENABLED: 'true', EMAIL_ENQUIRY_CONTEXT: 'deploy-preview', EMAIL_ENQUIRY_SITE_ID: siteId, EMAIL_ENQUIRY_ORIGIN: origin, RESEND_FROM_EMAIL: 'sender@example.com', EMAIL_ENQUIRY_TO: 'enquiries@lifeandleisure.travel', RESEND_API_KEY: 'offline-mock-only' }
const customer = { fullName: 'Fictional Audit Traveller', email: 'fictional+audit@example.com', phone: '+1 202 555 0123', country: 'Fictional country', privacyAcknowledged: true }
const samples = {
  flights: { from: 'Alpha Airport', to: 'Beta Airport', tripType: 'Return', departure: '2027-06-01', return: '2027-06-09', passengers: '3', cabin: 'Business' },
  hotels: { destination: 'Fictional Garden City', checkIn: '2027-06-01', checkOut: '2027-06-09', rooms: '2', guests: '3' },
  trains: { from: 'Alpha Station', to: 'Beta Station', departure: '2027-06-01', class: 'AC 2 Tier', passengers: '3' },
  visa: { destination: 'Fictional Country', nationality: 'Fictional nationality', purpose: 'Tourism', period: 'June 2027' },
  holidays: { destination: 'Fictional Island', month: '2027-06', travellers: '5', budget: '250000', currency: 'INR', preferences: 'Gardens & museums' },
  tailor_made: { destination: 'Fictional Island', period: 'June 2027', travellers: '3', interests: 'Gardens', budget: '250000', currency: 'INR' },
  inbound_india: { destination: 'Fictional India tour', arrival: '2027-06-01', departure: '2027-06-09', travellers: '3', experiences: 'Culture', budget: '250000', currency: 'INR' },
  travel_consultation: { topic: 'Fictional itinerary advice', destination: 'Fictional Island', period: 'June 2027' },
}
const pkg = { location: 'Original Island', title: 'Fictional Island Journey' }
const group = () => packageEnquiryContext(pkg, 'fictional-package', GROUP_PREFERENCE, { label: 'Summer' })
const input = context => ({ ...context, customer: { ...customer }, additionalRequirements: 'Quiet <garden> & culture', metadata: { ...context.metadata, clientRequestId: '00000000-0000-4000-8000-000000000002', submittedAt: clock.toISOString() } })
const request = payload => new Request(origin + '/api/enquiries', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
function mockServer() {
  const messages = []
  const run = createEmailEnquiryHandler({ env, notice: { ...PRIVACY_NOTICE, approved: true }, now: () => clock,
    requestEmail: async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails')
      messages.push(JSON.parse(options.body))
      return Response.json({ id: '00000000-0000-4000-8000-000000000003' })
    } })
  return { messages, send: payload => run(request(payload), runtime) }
}
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

test('package group preference survives without inventing a traveller count; exact count is required', async () => {
  const context = group()
  assert.equal(context.metadata.groupPreference, 'Group (4+)')
  assert.equal(context.travel.travellers, '')
  const enquiry = input({ ...context, travel: { ...samples.holidays, ...context.travel } })
  assert.ok(validateEnquiry(enquiry, '2026-10-26').travellers)
  const server = mockServer()
  const payload = JSON.parse(encodeEnquiry(enquiry))
  assert.equal((await server.send(payload)).status, 422)
  assert.equal(server.messages.length, 0)
  payload.travel.travellers = '5'
  assert.equal((await server.send(payload)).status, 200)
  for (const body of [server.messages[0].text, server.messages[0].html]) {
    assert.ok(body.includes('Group (4+)'))
    assert.ok(body.includes('Group-travel preference'))
  }
  assert.match(server.messages[0].text, /Travellers: 5/)
  for (const [selection, count] of [['1 Adult', '1'], ['2 Adults', '2'], ['3 Adults', '3']]) {
    const ordinary = packageEnquiryContext(pkg, 'fictional-package', selection)
    assert.equal(ordinary.travel.travellers, count)
    assert.equal(ordinary.metadata.groupPreference, undefined)
  }
})

test('all generic CTAs retain untrusted attribution without selecting a service or copying query data', async () => {
  for (const [id, label] of Object.entries(ENQUIRY_CTAS)) {
    const context = genericEnquiryContext({ pathname: '/packages/example', hash: '#details', search: '?email=do-not-copy@example.com' }, id)
    assert.equal(context.serviceType, '')
    assert.deepEqual(context.travel, {})
    assert.deepEqual(context.metadata, { sourcePath: '/packages/example#details', sourceCta: id })
    assert.ok(validateEnquiry(input(context), '2026-10-26').serviceType)
    const chosen = switchEnquiryService(context, 'hotels')
    assert.deepEqual(chosen.metadata, context.metadata)
    const payload = JSON.parse(encodeEnquiry(input({ ...chosen, travel: samples.hotels })))
    const server = mockServer()
    assert.equal((await server.send(payload)).status, 200)
    assert.ok(server.messages[0].text.includes(`Source CTA (customer-supplied): ${label}`))
    assert.ok(server.messages[0].html.includes(escape(label)))
    assert.doesNotMatch(server.messages[0].text, /do-not-copy/)
  }
  const files = {
    'src/components/layout/TopNav.jsx': ['header-contact', 'header-plan-trip'],
    'src/components/layout/MobileNavigation.jsx': ['mobile-contact', 'mobile-plan-trip'],
    'src/components/layout/Footer.jsx': ['footer-contact', 'footer-plan-link', 'footer-plan-trip'],
    'src/components/ui/HeroSection.jsx': ['hero-travel-expert'],
    'src/components/ui/ConsultationCTA.jsx': ['consultation-plan-trip'],
  }
  for (const [path, ids] of Object.entries(files)) {
    const source = readFileSync(path, 'utf8')
    assert.ok(source.includes('genericEnquiryContext(location,'), path)
    for (const id of ids) assert.ok(source.includes(`'${id}'`), `${path}: ${id}`)
    for (const link of source.matchAll(/<Link\b[^>]*to="\/contact"[^>]*>/g)) assert.match(link[0], /state=\{\{ enquiry: genericEnquiryContext/)
  }
})

test('original package destination stays separate from edited request in both escaped email formats', async () => {
  const context = group()
  const enquiry = input({ ...context, travel: { ...samples.holidays, destination: 'Edited <Island> & coast' } })
  const payload = JSON.parse(encodeEnquiry(enquiry))
  assert.equal(payload.metadata.destination, 'Original Island')
  const server = mockServer()
  assert.equal((await server.send(payload)).status, 200)
  const message = server.messages[0]
  assert.match(message.text, /Original package destination \(customer-supplied context\): Original Island/)
  assert.match(message.text, /Current requested destination: Edited <Island> & coast/)
  assert.ok(message.html.includes('Edited &lt;Island&gt; &amp; coast'))
  assert.ok(message.html.includes('Original package destination (customer-supplied context)'))
  assert.doesNotMatch(message.html, /<Island>|<garden>/)
  assert.deepEqual(message.to, ['enquiries@lifeandleisure.travel'])
  assert.equal(message.reply_to, customer.email)
  assert.doesNotMatch(message.subject, /[\r\n<>]/)
})

test('malformed and inappropriate metadata rejects before any provider call', async () => {
  const valid = JSON.parse(encodeEnquiry(input({ ...group(), travel: samples.holidays })))
  const server = mockServer()
  for (const key of ['sourceCta', 'groupPreference', 'destination', 'sourcePath']) {
    for (const value of [null, 42, [], {}, false, 'x\r\nBcc: attacker@example.com', 'x'.repeat(201)]) {
      assert.equal((await server.send({ ...valid, metadata: { ...valid.metadata, [key]: value } })).status, 422, `${key}: ${JSON.stringify(value)}`)
    }
  }
  for (const metadata of [
    { ...valid.metadata, sourceCta: 'constructor' },
    { ...valid.metadata, sourceCta: 'unknown-cta' },
    { ...valid.metadata, groupPreference: '4' },
    { ...valid.metadata, packageSlug: '' },
    { ...valid.metadata, sourcePath: '//evil.example/path' },
    { ...valid.metadata, sourcePath: '/path?email=private' },
    { ...valid.metadata, sourcePath: '/\\evil.example' },
  ]) assert.equal((await server.send({ ...valid, metadata })).status, 422)
  const hotel = JSON.parse(encodeEnquiry(input(createEnquiryContext('hotels', samples.hotels))))
  hotel.metadata.groupPreference = GROUP_PREFERENCE
  assert.equal((await server.send(hotel)).status, 422)
  assert.equal((await server.send({ ...valid, to: ['attacker@example.com'] })).status, 422)
  assert.equal(server.messages.length, 0)
})

test('switching clears package/group context, retains CTA attribution and restores only service drafts', () => {
  const original = { ...group(), travel: samples.holidays, metadata: { ...group().metadata, sourceCta: 'header-plan-trip' } }
  const switched = switchEnquiryService(original, 'hotels')
  assert.deepEqual(switched.travel, { destination: 'Fictional Island', guests: '5' })
  assert.deepEqual(switched.metadata, { sourcePath: '/packages/fictional-package', sourceCta: 'header-plan-trip' })
  const back = switchEnquiryService(switched, 'holidays', original.travel)
  assert.deepEqual(back.travel, original.travel)
  assert.equal(back.metadata.groupPreference, undefined)
  assert.equal(back.metadata.packageSlug, undefined)
  assert.deepEqual(input(switched).customer, customer)
})

test('all eight services and every homepage field reach both email formats through the real serializer and mocked handler', async () => {
  const variants = [
    ...Object.entries(samples),
    ['flights', { ...samples.flights, tripType: 'One-way', return: 'stale return' }],
    ['flights', { ...samples.flights, tripType: 'Multi-city', extraFlights: 3, nextFrom: 'Beta', nextTo: 'Gamma', nextDeparture: '2027-06-02', leg3From: 'Gamma', leg3To: 'Delta', leg3Date: '2027-06-03', leg4From: 'Delta', leg4To: 'Epsilon', leg4Date: '2027-06-04', leg5From: 'Epsilon', leg5To: 'Zeta', leg5Date: '2027-06-05' }],
  ]
  for (const [service, travel] of variants) {
    const payload = JSON.parse(encodeEnquiry(input(createEnquiryContext(service, travel, { sourcePath: '/' }))))
    const server = mockServer()
    assert.equal((await server.send(payload)).status, 200, service)
    const message = server.messages[0]
    for (const field of getServiceFields(service, travel)) {
      const value = travel[field.name]
      if (value === undefined || value === '') continue
      assert.equal(payload.travel[field.name], String(value), `${service}: ${field.name}`)
      const label = field.name === 'destination' ? 'Current requested destination' : field.label
      assert.ok(message.text.includes(`${label}: ${value}`), `${service}: ${field.name}`)
      assert.ok(message.html.includes(escape(value)), `${service}: ${field.name}`)
    }
    for (const value of [customer.fullName, customer.email, customer.phone, customer.country, 'Quiet <garden> & culture', '/', payload.metadata.clientRequestId]) {
      assert.ok(message.text.includes(value)); assert.ok(message.html.includes(escape(value)))
    }
    if (service === 'flights' && travel.tripType !== 'Return') assert.equal(payload.travel.return, undefined)
    assert.deepEqual(message.to, ['enquiries@lifeandleisure.travel'])
  }
})

test('Contact shows friendly package/group/current/original context and all twelve package routes render', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { packageDetails } = await server.ssrLoadModule('/src/data/packageDetails.js')
    const render = (pathname, enquiry) => renderToString(React.createElement(MemoryRouter, { initialEntries: [{ pathname, state: { enquiry } }] }, React.createElement(App)))
    assert.equal(Object.keys(packageDetails).length, 12)
    for (const [slug, detail] of Object.entries(packageDetails)) {
      assert.match(render(`/packages/${slug}`), /Enquire About This Trip/)
      const context = packageEnquiryContext(detail, slug, GROUP_PREFERENCE, detail.seasonalPricing?.[0])
      context.travel.destination = 'Edited Fictional Island'
      context.metadata.experience = 'Fictional tier'
      const html = render('/contact', context)
      for (const value of ['Your enquiry summary', 'Selected service', 'Selected package', escape(detail.title), 'Original package destination', escape(detail.location), 'Current requested destination', 'Edited Fictional Island', 'Group (4+)', 'accurate number of travellers', 'Fictional tier']) assert.ok(html.includes(value), `${slug}: ${value}`)
      assert.doesNotMatch(html, new RegExp(`<dd>${slug}</dd>`))
    }
    const generic = genericEnquiryContext({ pathname: '/services' }, 'header-plan-trip')
    const html = render('/contact', generic)
    assert.match(html, /Please choose a service/)
    assert.doesNotMatch(html, /<option value="(?:flights|hotels|holidays)" selected/)
    assert.match(html, /Header: Plan My Trip/)
    const chosen = { ...switchEnquiryService(generic, 'hotels'), travel: samples.hotels }
    assert.match(render('/contact', chosen), /<option value="hotels" selected="">/)
    assert.equal(PRIVACY_NOTICE.approved, false)
  } finally { await server.close() }
})
