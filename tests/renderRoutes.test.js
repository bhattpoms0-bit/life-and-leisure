import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

test('homepage links, enquiry handoff and existing routes render correctly', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { packageDetails } = await server.ssrLoadModule('/src/data/packageDetails.js')
    const render = (path, state) => {
      const { pathname, search, hash } = new URL(path, 'http://localhost')
      return renderToString(React.createElement(MemoryRouter, {
        initialEntries: [{ pathname, search, hash, state }],
      }, React.createElement(App)))
    }
    const home = render('/')
    assert.match(home, /Explore the World/)
    assert.equal((home.match(/role="tab"/g) || []).length, 5)
    assert.equal((home.match(/role="tabpanel"/g) || []).length, 5)
    assert.equal((home.match(/<h1\b/g) || []).length, 1)
    assert.doesNotMatch(home, /Verified Traveler|98%|150\+|2,000\+|href="#"/)
    // Check both responsive sizes so a deployed India card cannot select a missing file.
    const indiaImages = [...home.matchAll(/(?:src|srcSet)="([^"]*\/images\/india\/[^"]+)"/gi)]
    assert.ok(indiaImages.length >= 4, 'India photography must render')
    for (const [, sources] of indiaImages) {
      for (const source of sources.split(',')) {
        const path = source.trim().split(/\s+/)[0]
        const bytes = readFileSync(fileURLToPath(new URL(`../public${path}`, import.meta.url)))
        assert.equal(bytes.readUInt16BE(0), 0xffd8, `Valid JPEG: ${path}`)
      }
    }
    const routes = new Set(['/', '/packages', '/destinations', '/destinations/vietnam', '/destinations/thailand', '/visa', '/services', '/contact', '/privacy-policy',
      ...Object.keys(packageDetails).map(slug => `/packages/${slug}`)])
    // Inspect navigation anchors, excluding React's automatic image preload links.
    for (const match of home.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&')
      const url = new URL(href, 'http://localhost')
      if (url.protocol === 'mailto:') continue
      assert.ok(routes.has(url.pathname), `Unknown navigation route: ${href}`)
      if (url.hash) assert.ok(home.includes(`id="${url.hash.slice(1)}"`), `Missing anchor: ${href}`)
    }
    for (const route of routes) assert.ok(render(route).includes('<main'), `Could not render ${route}`)
    assert.equal(Object.keys(packageDetails).length, 12)
    for (const slug of Object.keys(packageDetails)) assert.match(render(`/packages/${slug}`), /Enquire About This Trip/)
    assert.match(render('/#discover-india'), /id="discover-india"/)
    assert.match(render('/?service=hotels#service-selector'), /id="service-selector"/)
    const contact = render('/contact', { enquiry: { serviceType: 'hotels', travel: { destination: 'Kyoto' } } })
    assert.match(contact, /value="Kyoto"/)
    assert.match(contact, /Privacy information is awaiting business approval/)
    assert.doesNotMatch(contact, /received your message/)
    const { businessDetails } = await server.ssrLoadModule('/src/data/businessDetails.js')
    assert.ok(contact.includes(`href="mailto:${businessDetails.email}"`))
    assert.ok(home.includes(`href="mailto:${businessDetails.email}"`))
    const { SERVICES, serviceCardEnquiry } = await server.ssrLoadModule('/src/data/serviceCatalogue.js')
    const servicesPage = render('/services')
    assert.equal((servicesPage.match(/aria-label="Enquire about /g) || []).length, SERVICES.length)
    for (const service of SERVICES) {
      const enquiry = serviceCardEnquiry(service)
      assert.equal(enquiry.metadata.sourcePath, '/services')
      assert.equal(enquiry.metadata.experience, service.title)
      const handoff = render('/contact', { enquiry })
      assert.ok(handoff.includes(`<option value="${service.enquiryService}" selected="">`), service.title)
      assert.ok(handoff.includes(service.title.replaceAll('&', '&amp;')), service.title)
    }
    for (const [anchor] of servicesPage.matchAll(/<a\b[^>]*aria-label="Enquire about [^>]*>/g)) assert.match(anchor, /href="\/contact"/)
    assert.match(render('/contact', { enquiry: { serviceType: 'travel_consultation' } }), /What would you like help with\?/)
  } finally {
    await server.close()
  }
})
