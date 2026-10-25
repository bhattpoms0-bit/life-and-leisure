import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { businessDetails } from '../src/data/businessDetails.js'
import { PRIVACY_NOTICE, intakeAvailability } from '../src/data/enquiryConfig.js'
import { encodeEnquiry, validateEnquiry } from '../src/lib/enquirySubmission.js'
import { enquiryServices } from '../src/lib/serviceEnquiry.js'

test('revised acknowledgement tracks its draft version and cannot activate intake', () => {
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal(PRIVACY_NOTICE.version, 'phase2a-draft-3')
  assert.equal(PRIVACY_NOTICE.text, `${PRIVACY_NOTICE.beforeLink}Privacy Policy${PRIVACY_NOTICE.afterLink}`)
  assert.match(PRIVACY_NOTICE.text, /I have read the Privacy Policy and agree to Life & Leisure Travel/)
  assert.match(PRIVACY_NOTICE.text, /submitting an enquiry does not confirm a booking/)
  const input = { customer: { fullName: 'Synthetic Traveller', email: 'test@example.com', privacyAcknowledged: false }, serviceType: 'travel_consultation', travel: { topic: 'Travel options' }, additionalRequirements: '' }
  assert.ok(validateEnquiry(input).privacyAcknowledged)
  input.customer.privacyAcknowledged = true
  assert.deepEqual(validateEnquiry(input), {})
  const payload = new URLSearchParams(encodeEnquiry(input))
  assert.equal(payload.get('privacy_notice_version'), PRIVACY_NOTICE.version)
  assert.equal(payload.get('privacy_acknowledged'), 'yes')
  assert.notEqual(intakeAvailability({ enabled: true, hostname: 'lifeandleisure.travel' }), '')
  assert.equal(enquiryServices.length, 8)
})

test('draft policy, business identity, footer and accessible contact acknowledgement render', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const render = path => renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App))).replaceAll('&amp;', '&').replaceAll('<!-- -->', '')
    const policy = render('/privacy-policy')
    const article = policy.match(/<article\b[\s\S]*?<\/article>/)?.[0]
    assert.ok(article)
    assert.match(article, /Draft for owner review/)
    assert.match(article, /not approved/)
    assert.match(article, /final policy approval is pending/)
    assert.match(article, /No effective date has been set/)
    assert.match(article, /Online enquiry submission remains disabled/)
    assert.equal((article.match(/<section\b/g) || []).length, 13)
    for (const heading of ['Who We Are', 'Information We Collect', 'Why We Collect Information', 'How We Use Enquiry Information', 'Service Providers', 'Data Sharing', 'Access to Information', 'Enquiry Retention', 'Customer Privacy Requests', 'Information Security', 'International Enquiries', 'Policy Updates', 'Contact Information']) assert.ok(article.includes(heading), heading)
    for (const [, id] of article.matchAll(/href="#([^"]+)"/g)) assert.ok(article.includes(`id="${id}"`), id)
    for (const value of [businessDetails.legalName, businessDetails.gstin, businessDetails.email, businessDetails.website]) assert.ok(article.includes(value), value)
    for (const office of businessDetails.offices) {
      assert.ok(article.includes(office.label))
      for (const line of office.lines) assert.ok(article.includes(line), line)
    }
    assert.match(article, /Registered office \(Delhi\)/)
    assert.match(article, /Additional office \(Pithoragarh\)/)
    assert.doesNotMatch(article, /Neither is identified here as a registered office/)
    assert.equal(businessDetails.legalName, 'LIFE & LEISURE INDIA PRIVATE LIMITED')
    assert.equal(businessDetails.gstin, '07AANCM4800A1ZV')
    assert.deepEqual(businessDetails.offices, [
      { label: 'Registered office (Delhi)', lines: ['107-108, 1st Floor,', 'Roots Tower,', 'District Centre, Laxmi Nagar,', 'Delhi - 110092, India'] },
      { label: 'Additional office (Pithoragarh)', lines: ['Netcom Cyber,', 'Meghna Complex,', 'Simalgair Market,', 'Siltham,', 'Pithoragarh - 262501,', 'Uttarakhand, India'] },
    ])
    const providers = article.match(/<section id="service-providers"[\s\S]*?<\/section>/)?.[0]
    assert.ok(providers)
    for (const text of ['Enquiry processing.', 'Netlify Forms', 'Google Workspace', 'Website asset delivery.', 'Google Fonts', 'Material Symbols', 'fonts.googleapis.com', 'fonts.gstatic.com', 'images.unsplash.com', 'IP address', 'browser details', 'request metadata']) assert.ok(providers.includes(text), text)
    assert.match(providers, /Our enquiry form does not send travel enquiry submissions to the font or image providers/)
    assert.doesNotMatch(providers, /cookies|tracking pixels|analytics/i)
    assert.match(article, /90 days after the last relevant customer communication/)
    assert.match(article, /not automatic deletion/)
    assert.match(article, /The business owner will review enquiries weekly/)
    assert.match(article, /business owner is the single authorized staff member/)
    assert.match(article, /ongoing enquiry, active booking, legal obligation, accounting requirement, or dispute/)
    assert.match(article, /deletion process has not yet been operationally verified/)
    assert.match(article, /Technical access controls and deletion processes have not been independently verified/)
    assert.match(article, /Netlify/)
    assert.match(article, /Google Workspace/)
    assert.match(article, /outside India/)
    assert.match(article, /does not automatically subscribe you to marketing emails/)
    assert.match(article, /Separate permission is required before we send promotional marketing communications/)
    const home = render('/')
    assert.ok(home.includes(`Operated by ${businessDetails.legalName}.`))
    assert.match(home, /href="\/privacy-policy"/)
    const contact = render('/contact')
    assert.match(contact, /<label[^>]*for="privacy-ack"/)
    const checkbox = contact.match(/<input\b[^>]*id="privacy-ack"[^>]*>/)?.[0]
    assert.ok(checkbox)
    assert.match(checkbox, /type="checkbox"/)
    assert.match(checkbox, /required=""/)
    assert.doesNotMatch(checkbox, /checked=/)
    const acknowledgement = contact.match(/<label class="privacy-ack"[\s\S]*?<\/label>/)?.[0]
    assert.ok(acknowledgement)
    assert.match(acknowledgement, /href="\/privacy-policy"/)
    assert.match(acknowledgement, /target="_blank"/)
    assert.match(acknowledgement, /rel="noopener noreferrer"/)
    assert.match(acknowledgement, /opens in a new tab/)
    assert.match(acknowledgement, /does not confirm a booking/)
    assert.match(contact, /<button[^>]*type="submit"[^>]*disabled=""/)
    assert.ok(contact.includes(`mailto:${businessDetails.email}`))
  } finally { await server.close() }
})
