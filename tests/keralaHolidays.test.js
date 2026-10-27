import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { readFileSync } from 'node:fs'
import { createEmailEnquiryHandler } from '../netlify/lib/enquiryHandler.mjs'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'

test('Kerala catalogue preserves indicative prices, occupancy conditions and complete supplied itineraries', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { keralaPackages, KERALA_PRICING_CONDITIONS, KERALA_EXCLUSIONS } = await server.ssrLoadModule('/src/data/domesticHolidays.js')
    assert.deepEqual(keralaPackages.map(pkg => [pkg.tier, pkg.amount, pkg.currency, pkg.days, pkg.nights]), [
      ['Base', 29999, 'INR', 6, 5], ['Signature', 44999, 'INR', 6, 5], ['Premium', 74999, 'INR', 7, 6],
    ])
    for (const pkg of keralaPackages) {
      assert.deepEqual(pkg.itinerary.map(day => day.day), Array.from({ length: pkg.days }, (_, i) => i + 1))
      assert.equal(pkg.itinerary.filter(day => day.overnight).length, pkg.nights)
      assert.equal(pkg.travelDate, undefined)
      assert.equal(pkg.priceBreakdown, undefined)
      assert.equal(readFileSync(`public${pkg.image}`).readUInt16BE(0), 0xffd8)
    }
    assert.match(KERALA_PRICING_CONDITIONS.join(' '), /not confirmed selling prices.*minimum of four adults.*twin\/double.*Two-person and family pricing.*No flights included/s)
    assert.match(KERALA_EXCLUSIONS.join(' '), /flights.*Meals not specifically included.*Additional Ayurveda treatments.*final quotation/s)
    const [base, signature, premium] = keralaPackages
    assert.match(base.optional, /Ayurvedic massage.*cultural show.*houseboat upgrade/)
    assert.match(base.inclusions.join(' '), /parking and standard route tolls.*Scheduled backwater cruise/)
    assert.match(signature.itinerary[3].body, /60-minute.*practitioner screening, guest consent and scheduling/)
    assert.match(premium.inclusions.join(' '), /Two curated Ayurvedic wellness sessions per consenting adult.*qualified-provider screening and availability/)
    assert.match(premium.itinerary[5].body, /responsible local operator.*private Kumarakom backwater cruise.*second curated Ayurvedic.*farewell dinner/)
    assert.match(premium.itinerary[6].body, /2–3 hours.*airport reporting time/)
  } finally { await server.close() }
})

test('domestic routes, navigation, pricing disclosures and accessible Contact summaries render separately from international packages', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { packages } = await server.ssrLoadModule('/src/data/packages.js')
    const { packageDetails } = await server.ssrLoadModule('/src/data/packageDetails.js')
    const { keralaPackages, domesticEnquiryContext, domesticPackagePath } = await server.ssrLoadModule('/src/data/domesticHolidays.js')
    const render = (path, enquiry) => renderToString(React.createElement(MemoryRouter, { initialEntries: [{ pathname: path, state: enquiry ? { enquiry } : undefined }] }, React.createElement(App))).replaceAll('<!-- -->', '').replaceAll('&amp;', '&')
    assert.equal(packages.length, 12)
    assert.equal(Object.keys(packageDetails).length, 12)
    for (const route of ['/', '/domestic-holidays', '/domestic-holidays/kerala']) {
      const html = render(route)
      assert.match(html, /href="\/domestic-holidays"/)
      assert.match(html, /href="\/packages"/)
      if (route !== '/domestic-holidays/kerala') assert.match(html, /href="\/domestic-holidays\/kerala"/)
    }
    const collection = render('/domestic-holidays/kerala')
    assert.match(collection, /minimum of four adults.*twin\/double/s)
    assert.match(collection, /Two-person and family pricing must be quoted separately/)
    const listing = render('/packages')
    assert.match(listing, /International Holidays/)
    for (const pkg of keralaPackages) {
      assert.ok(!listing.includes(pkg.title))
      assert.ok(collection.includes(pkg.title))
      const html = render(domesticPackagePath(pkg))
      assert.ok(html.includes(pkg.title))
      assert.ok(html.includes(pkg.price))
      assert.match(html, /Indicative starting from/)
      assert.match(html, /not confirmed selling prices/)
      assert.match(html, /Two-person and family pricing must be quoted separately/)
      assert.match(html, /No flights included/)
      assert.doesNotMatch(html, /Subtotal|Taxes & Fees|>Total<|<form\b|Book Now|Pay Now/)
      assert.equal((html.match(/<span class="eyebrow">Day /g) || []).length, pkg.days)
      const context = domesticEnquiryContext(pkg)
      assert.equal(context.travel.travellers, undefined, 'Occupancy basis must not invent the customer count')
      assert.equal(context.travel.budget, undefined, 'Indicative price must not become customer budget')
      const contact = render('/contact', context)
      for (const value of [pkg.title, 'Kerala, India', `Kerala ${pkg.tier}`, 'min 4 adults, twin/double']) assert.ok(contact.includes(value), value)
      assert.match(contact, /<option value="holidays" selected="">/)
      assert.match(contact, /<button[^>]*type="submit"[^>]*disabled=""/)
    }
    assert.match(render('/domestic-holidays/kerala/unknown'), /Package not found/)
  } finally { await server.close() }
})

test('each Kerala tier reaches the existing validated HTML and text email through mocked delivery only', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { keralaPackages, domesticEnquiryContext, domesticPackagePath } = await server.ssrLoadModule('/src/data/domesticHolidays.js')
    const { encodeEnquiry } = await server.ssrLoadModule('/src/lib/enquirySubmission.js')
    const origin = 'https://deploy-preview-1--offline-test.netlify.app'
    const siteId = '00000000-0000-4000-8000-000000000001'
    const clock = new Date('2026-10-27T09:00:00Z')
    const env = { EMAIL_ENQUIRY_ENABLED: 'true', EMAIL_ENQUIRY_CONTEXT: 'deploy-preview', EMAIL_ENQUIRY_SITE_ID: siteId, EMAIL_ENQUIRY_ORIGIN: origin, RESEND_FROM_EMAIL: 'notifications@mail.lifeandleisure.travel', EMAIL_ENQUIRY_TO: 'enquiries@lifeandleisure.travel', RESEND_API_KEY: 'offline-mock-only' }
    for (const pkg of keralaPackages) {
      for (const travellers of ['2', '4']) {
        let calls = 0, email
        const handler = createEmailEnquiryHandler({ env, now: () => clock, requestEmail: async (_, options) => { calls++; email = JSON.parse(options.body); return Response.json({ id: '00000000-0000-4000-8000-000000000003' }) } })
        const context = domesticEnquiryContext(pkg)
        const input = { ...context, travel: { ...context.travel, month: '2027-06', travellers, budget: 'Please advise', currency: 'INR' }, customer: { fullName: 'Fictional Kerala Traveller', email: 'fictional@example.com', privacyAcknowledged: true }, metadata: { ...context.metadata, clientRequestId: '00000000-0000-4000-8000-000000000002', submittedAt: clock.toISOString() } }
        const payload = encodeEnquiry(input)
        const response = await handler(new Request(origin + '/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: payload }), { site: { id: siteId }, deploy: { context: 'deploy-preview' } })
        assert.equal(response.status, 200)
        assert.equal(calls, 1)
        assert.deepEqual(email.to, ['enquiries@lifeandleisure.travel'])
        for (const value of [pkg.slug, `Kerala ${pkg.tier}`, domesticPackagePath(pkg), 'Kerala, India', `INR ${pkg.amount} pp`, 'min 4 adults, twin/double', '2-person/family quote separately']) {
          assert.ok(email.text.includes(value), value)
          assert.ok(email.html.includes(value), value)
        }
        assert.ok(email.text.includes(`Travellers: ${travellers}`))
        assert.equal(JSON.parse(payload).privacyNoticeVersion, PRIVACY_NOTICE.version)
      }
    }
  } finally { await server.close() }
})
