import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

test('India & Around preserves the collection, licensed assets and bespoke enquiry paths', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { indiaAround } = await server.ssrLoadModule('/src/data/indiaAround.js')
    const { navigation } = await server.ssrLoadModule('/src/data/navigation.js')
    const { indiaJourneys } = await server.ssrLoadModule('/src/data/indiaJourneys.js')
    const { createEnquiryContext } = await server.ssrLoadModule('/src/lib/serviceEnquiry.js')
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const render = (pathname, state) => renderToString(React.createElement(MemoryRouter, { initialEntries: [{ pathname, state }] }, React.createElement(App)))
    assert.deepEqual(indiaAround.map(item => item.name), ['Kerala', 'Goa', 'Kashmir', 'Rajasthan', 'Seven Sisters', 'Nepal', 'Bhutan', 'Himachal Pradesh'])
    assert.equal(indiaAround[0].status, '3 Packages Available')
    assert.equal(indiaAround[0].to, '/domestic-holidays/kerala')
    assert.ok(indiaAround.slice(1).every(item => item.status === 'Coming Soon' && !item.to && !('price' in item)))
    assert.equal(indiaAround.find(item => item.key === 'nepal').country, 'Nepal')
    assert.equal(indiaAround.find(item => item.key === 'bhutan').country, 'Bhutan')
    assert.equal(navigation.filter(item => item.label === 'India & Around').length, 1)
    assert.equal(navigation.find(item => item.label === 'India & Around').to, '/#discover-india')
    assert.ok(!navigation.some(item => item.label === 'India Tours'))
    for (const { photo } of indiaAround) {
      assert.match(photo.source, /^https:\/\//)
      assert.match(photo.licenceUrl, /^https:\/\//)
      assert.ok(photo.author && photo.width > 0 && photo.height > 0)
      for (const source of photo.srcSet.split(',')) {
        const path = source.trim().split(/\s+/)[0]
        const bytes = readFileSync(new URL(`../public${path}`, import.meta.url))
        assert.ok(bytes.length > 1000 && bytes.length < 600000, path)
        assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', path)
        assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', path)
      }
    }
    const home = render('/')
    assert.equal((home.match(/id="discover-india"/g) || []).length, 1)
    assert.equal((home.match(/class="india-around-card"/g) || []).length, 8)
    assert.equal((home.match(/<h2[^>]*>India &amp; Around<\/h2>/g) || []).length, 1)
    assert.equal((home.match(/>Coming Soon<\/span>/g) || []).length, 7)
    assert.match(home, /From India&#x27;s iconic landscapes to the hidden wonders of the Himalayas\./)
    assert.match(home, /id="india-experiences"/)
    assert.equal(indiaJourneys.length, 4)
    for (const journey of indiaJourneys) {
      assert.ok(home.includes(journey.heading))
      const enquiry = createEnquiryContext('inbound_india', { destination: journey.location, experiences: journey.title }, { sourcePath: '/#discover-india', destination: journey.location, experience: journey.title })
      const contact = render('/contact', { enquiry })
      assert.match(contact, /value="inbound_india" selected=""/)
      assert.ok(contact.includes(journey.location))
    }
    assert.match(render('/domestic-holidays/kerala'), /Kerala Serenity Escape/)
    for (const slug of ['kerala-classic', 'kerala-serenity', 'kerala-private-luxury']) assert.match(render(`/domestic-holidays/kerala/${slug}`).replaceAll('<!-- -->', ''), /Day 6/)
  } finally {
    await server.close()
  }
})
