import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { getDepartureStatus, PRICING_DISCLAIMER } from '../src/lib/packagePricing.js'
import { parsePrice } from '../src/lib/currency.js'

test('Greece and Serengeti use fixed owner-approved INR amounts, with consistent INR catalogue records', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { packages } = await server.ssrLoadModule('/src/data/packages.js')
    const { packageDetails } = await server.ssrLoadModule('/src/data/packageDetails.js')
    for (const [slug, amount, formatted] of [
      ['grecian-isles-grand-tour', 549000, '₹5,49,000'],
      ['serengeti-luxury-safari', 799000, '₹7,99,000'],
    ]) {
      const listing = packages.find(pkg => pkg.slug === slug)
      const detail = packageDetails[slug]
      assert.equal(listing.price, formatted)
      assert.equal(detail.price, formatted)
      assert.deepEqual(parsePrice(listing.price), { symbol: '₹', amount })
      assert.equal(detail.priceBreakdown, undefined, 'Retired USD totals must not contradict the approved INR price')
    }
    for (const listing of packages) {
      const detail = packageDetails[listing.slug]
      assert.equal(listing.price, detail.price ?? detail.seasonalPricing?.[0]?.price, listing.slug)
      for (const price of [listing.price, detail.price, ...(detail.seasonalPricing ?? []).map(season => season.price)].filter(Boolean)) {
        assert.match(price, /^₹[\d,]+$/)
        assert.doesNotMatch(price, /\$|USD/)
      }
    }
  } finally { await server.close() }
})

test('departures expire after their start date in India, with no invented dates', () => {
  const departure = 'Oct 27 - Nov 3, 2026'
  assert.equal(getDepartureStatus(departure, new Date('2026-10-26T18:29:59Z')), 'scheduled')
  assert.equal(getDepartureStatus(departure, new Date('2026-10-26T18:30:00Z')), 'scheduled')
  assert.equal(getDepartureStatus(departure, new Date('2026-10-27T18:30:00Z')), 'expired')
  assert.equal(getDepartureStatus('Oct 15 - Oct 22, 2026', new Date('2026-10-27T00:00:00Z')), 'expired')
  assert.equal(getDepartureStatus('Feb 29 - Mar 1, 2028', new Date('2028-02-28T00:00:00Z')), 'scheduled')
  for (const value of [null, undefined, 42, [], {}, '', 'Dates on request', 'Feb 29 - Mar 1, 2027', 'Feb 30 - Mar 2, 2028', 'Foo 1 - Nov 3, 2026', 'Nov 3 - Oct 27, 2026']) {
    assert.equal(getDepartureStatus(value, new Date('2026-10-27T00:00:00Z')), 'unconfirmed', String(value))
  }
  assert.equal(getDepartureStatus(departure, new Date('invalid')), 'unconfirmed')
})

test('all twelve package pages retain approved starting prices and enquiry choices without calculated totals', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { packages } = await server.ssrLoadModule('/src/data/packages.js')
    const { packageDetails } = await server.ssrLoadModule('/src/data/packageDetails.js')
    const { packageEnquiryContext, GROUP_PREFERENCE, enquiryServices } = await server.ssrLoadModule('/src/lib/serviceEnquiry.js')
    const { encodeEnquiry } = await server.ssrLoadModule('/src/lib/enquirySubmission.js')
    const render = (path, enquiry) => renderToString(React.createElement(MemoryRouter, {
      initialEntries: [{ pathname: path, state: enquiry ? { enquiry } : undefined }],
    }, React.createElement(App))).replaceAll('<!-- -->', '').replaceAll('&amp;', '&')
    const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    assert.equal(packages.length, 12)
    assert.equal(Object.keys(packageDetails).length, 12)
    assert.equal(enquiryServices.length, 8)
    const approvedPrices = ['₹99,999', '₹5,49,000', '₹7,99,000', '₹38,999', '₹1,15,000', '₹49,999', '₹1,65,000', '₹72,999', '₹99,999', '₹1,49,999', '₹74,999', '₹89,999']
    assert.deepEqual(packages.map(pkg => pkg.price), approvedPrices)
    for (const [index, listing] of packages.entries()) {
      const pkg = packageDetails[listing.slug]
      const html = render(`/packages/${listing.slug}`)
      assert.doesNotMatch(text(html), /\$\s*\d|\bUSD\b/, listing.slug)
      assert.ok(text(html).includes(`Starting from ${approvedPrices[index]} per person`), listing.slug)
      assert.ok(html.includes(PRICING_DISCLAIMER), listing.slug)
      assert.doesNotMatch(html, /Subtotal|Taxes & Fees|>Total<|Starts from/)
      for (const choice of ['1 Adult', '2 Adults', '3 Adults', 'Group (4+)']) assert.ok(html.includes(`<option${choice === '2 Adults' ? ' selected=""' : ''}>${choice}</option>`), `${listing.slug}: ${choice}`)
      assert.match(html, /href="\/contact"[^>]*>Enquire About This Trip/)
      const status = getDepartureStatus(pkg.travelDate)
      if (status === 'expired') {
        assert.ok(text(html).includes(`Departure unavailable: ${pkg.travelDate}.`))
        assert.ok(!html.includes(`value="${pkg.travelDate}"`))
      } else if (status === 'scheduled') assert.ok(html.includes(`value="${pkg.travelDate}"`))
      for (const choice of ['1 Adult', '2 Adults', '3 Adults', GROUP_PREFERENCE]) {
        const context = packageEnquiryContext(pkg, listing.slug, choice, pkg.seasonalPricing?.[0])
        const payload = JSON.parse(encodeEnquiry({ ...context, customer: { fullName: 'Fictional Traveller', email: 'fictional@example.com', privacyAcknowledged: true } }))
        assert.equal(payload.serviceType, 'holidays')
        assert.equal(payload.metadata.packageSlug, listing.slug)
        assert.equal(payload.metadata.destination, pkg.location)
        assert.equal(payload.metadata.sourcePath, `/packages/${listing.slug}`)
        assert.equal(payload.travel.travellers, choice === GROUP_PREFERENCE ? '' : choice[0])
        if (choice === GROUP_PREFERENCE) assert.equal(payload.metadata.groupPreference, GROUP_PREFERENCE)
        if (pkg.seasonalPricing) assert.equal(payload.travel.preferences, 'Preferred season: Low Season')
      }
    }
    assert.deepEqual(packageDetails['bali-signature-escape'].seasonalPricing.map(season => season.price), ['₹72,999', '₹79,999', '₹89,999'])
    const expired = packageEnquiryContext(packageDetails['bali-signature-escape'], 'bali-signature-escape', GROUP_PREFERENCE, { label: 'Peak Season' })
    const contactHtml = render('/contact', expired)
    const contact = text(contactHtml)
    for (const value of ['Bali Signature Escape', 'Original package destination', 'Group (4+)']) assert.ok(contact.includes(value), value)
    assert.ok(contactHtml.includes('Preferred season: Peak Season'))
    for (const route of ['/', '/packages', '/destinations/vietnam', '/destinations/thailand']) {
      const html = render(route)
      assert.doesNotMatch(text(html), /\$\s*\d|\bUSD\b/, route)
      assert.ok(html.includes(PRICING_DISCLAIMER), route)
      assert.ok(text(html).includes('Starting from'), route)
      assert.ok(text(html).includes('per person'), route)
    }
    const listing = text(render('/packages'))
    for (const price of approvedPrices) assert.ok(listing.includes(`Starting from ${price} per person`), price)
    for (const [route, prices] of [['/destinations/vietnam', ['₹38,999', '₹62,999', '₹1,15,000']], ['/destinations/thailand', ['₹49,999', '₹79,999', '₹1,65,000']]]) {
      const page = text(render(route))
      for (const price of prices) assert.ok(page.includes(`Starting from ${price} per person`), `${route}: ${price}`)
    }
  } finally { await server.close() }
})
