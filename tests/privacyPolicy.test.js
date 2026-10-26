import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { readFileSync } from 'node:fs'
import { businessDetails } from '../src/data/businessDetails.js'
import { PRIVACY_NOTICE, intakeAvailability } from '../src/data/enquiryConfig.js'
import { encodeEnquiry, validateEnquiry } from '../src/lib/enquirySubmission.js'
import { enquiryServices } from '../src/lib/serviceEnquiry.js'

test('revised acknowledgement tracks its draft version and cannot activate intake', () => {
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal(PRIVACY_NOTICE.version, 'email-first-draft-1')
  assert.equal(PRIVACY_NOTICE.effectiveDate, null)
  assert.equal(PRIVACY_NOTICE.text, `${PRIVACY_NOTICE.beforeLink}Privacy Policy${PRIVACY_NOTICE.afterLink}`)
  assert.match(PRIVACY_NOTICE.text, /I have read the Privacy Policy and agree to Life & Leisure Travel/)
  assert.match(PRIVACY_NOTICE.text, /submitting an enquiry does not confirm a booking/)
  const input = { customer: { fullName: 'Synthetic Traveller', email: 'test@example.com', privacyAcknowledged: false }, serviceType: 'travel_consultation', travel: { topic: 'Travel options' }, additionalRequirements: '' }
  assert.ok(validateEnquiry(input).privacyAcknowledged)
  input.customer.privacyAcknowledged = true
  assert.deepEqual(validateEnquiry(input), {})
  const payload = JSON.parse(encodeEnquiry(input))
  assert.equal(payload.privacyNoticeVersion, PRIVACY_NOTICE.version)
  assert.equal(payload.customer.privacyAcknowledged, true)
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
    assert.match(article, /Before adoption, the owner must verify provider terms/)
    assert.match(article, /These operational and legal checks have not been completed by this implementation/)
    assert.match(article, /Acceptance by the email provider does not confirm delivery to our inbox/)
    assert.doesNotMatch(article, /its account, sender verification and credentials have not yet been configured/)
    assert.match(article, /No effective date has been set/)
    assert.match(article, /Online enquiry submission remains disabled/)
    assert.equal((article.match(/<section\b/g) || []).length, 13)
    for (const heading of ['Who We Are', 'Information We Collect', 'Why We Collect Information', 'How We Use Enquiry Information', 'Service Providers', 'Data Sharing', 'Access to Information', 'Enquiry Retention', 'Customer Privacy Requests', 'Information Security', 'International Enquiries', 'Policy Updates', 'Contact Information']) assert.ok(article.includes(heading), heading)
    for (const [, id] of article.matchAll(/href="#([^"]+)"/g)) assert.ok(article.includes(`id="${id}"`), id)
    for (const value of [businessDetails.legalName, businessDetails.gstin, businessDetails.email, businessDetails.website]) assert.ok(article.includes(value), value)
    assert.ok(article.includes(`${businessDetails.brandName} is a customer-facing brand operated by ${businessDetails.legalName}`))
    assert.ok(article.includes(`Legal name: ${businessDetails.legalName}`))
    assert.ok(article.includes(`Trade name recorded for the business: ${businessDetails.tradeName}`))
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
    for (const text of ['Enquiry processing.', 'Resend', 'Google Workspace', 'Website asset delivery.', 'Google Fonts', 'Material Symbols', 'fonts.googleapis.com', 'fonts.gstatic.com', 'images.unsplash.com', 'IP address', 'browser details', 'request metadata']) assert.ok(providers.includes(text), text)
    assert.match(providers, /Our enquiry form does not send travel enquiry submissions to the font or image providers/)
    assert.match(providers, /href="https:\/\/resend.com\/security\/gdpr"/)
    assert.match(providers, /30 days on its Free plan while the account is active/)
    assert.match(providers, /stored data is held in the United States/)
    assert.match(providers, /sending region controls where email is sent from, not where data is stored/)
    assert.match(providers, /business owner reports that Resend open and click tracking are not configured/)
    assert.match(providers, /has selected Opportunistic TLS/)
    assert.match(providers, /may send without encryption if the receiving server does not support TLS/)
    assert.match(providers, /These account settings have not been independently verified/)
    assert.doesNotMatch(providers, /cookies|tracking pixels|analytics/i)
    assert.match(article, /90 days after the last relevant customer communication/)
    assert.match(article, /not automatic deletion/)
    assert.match(article, /The business owner will review enquiries weekly/)
    const retention = article.match(/<section id="retention"[\s\S]*?<\/section>/)?.[0]
    assert.ok(retention)
    assert.match(retention, /propose keeping a private Google Sheet deletion register/)
    assert.match(retention, /without copying enquiry messages, contact details or sensitive documents/)
    assert.match(retention, /six calendar months after the recorded review or deletion action/)
    assert.match(retention, /subject to legal review/)
    assert.match(retention, /documented legal, accounting or dispute-related exception/)
    assert.match(retention, /proposal is not yet implemented or approved/)
    assert.match(retention, /does not extend the ordinary 90-day enquiry retention target/)
    assert.match(article, /business owner is the single authorized staff member/)
    assert.match(article, /ongoing enquiry, active booking, legal obligation, accounting requirement, or dispute/)
    assert.match(article, /deletion process has not yet been operationally verified/)
    assert.match(article, /Technical access controls and deletion processes have not been independently verified/)
    assert.match(article, /Two-factor authentication settings and provider deletion procedures have not been independently verified/)
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

test('operating documents separate proposed minimal register retention from enquiries and qualify provider facts', () => {
  const procedure = readFileSync('docs/ENQUIRY_RETENTION_PROCEDURE.md', 'utf8')
  const operation = readFileSync('docs/EMAIL_FIRST_ENQUIRIES.md', 'utf8')
  assert.match(procedure, /private Google Sheet.*separate from active-enquiry tracking/)
  assert.match(procedure, /No Sheet, integration or records are created/)
  assert.match(procedure, /six calendar months after the recorded review or deletion action/)
  assert.match(procedure, /Do not restart an old entry's clock merely because it was opened or checked/)
  assert.match(procedure, /Do not copy names, email addresses, phone numbers, message bodies/)
  assert.match(procedure, /deleting a row is not proof of provider-wide erasure/)
  for (const document of [procedure, operation]) {
    assert.match(document, /legal review/)
    assert.match(document, /30 days/)
    assert.match(document, /United States/)
    assert.match(document, /Opportunistic TLS/)
    assert.match(document, /fall back to unencrypted delivery/)
    assert.match(document, /have not been independently verified/)
    for (const link of ['https://resend.com/security/gdpr', 'https://resend.com/docs/dashboard/domains/tls', 'https://resend.com/docs/dashboard/domains/tracking']) assert.ok(document.includes(link))
  }
  assert.equal(PRIVACY_NOTICE.approved, false)
  assert.equal(PRIVACY_NOTICE.version, 'email-first-draft-1')
  assert.equal(PRIVACY_NOTICE.effectiveDate, null)
})
