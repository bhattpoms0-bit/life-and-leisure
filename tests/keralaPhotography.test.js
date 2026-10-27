import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

test('Kerala photo renditions exist with documented reusable licences and bounded sizes', () => {
  const photos = JSON.parse(readFileSync('public/images/kerala/editorial-photography-credits.json', 'utf8'))
  assert.deepEqual(photos.map(photo => photo.key), ['munnar-panorama', 'munnar-mist', 'thekkady-mist', 'alleppey-cruise', 'kumarakom-reflections', 'kochi-evening', 'kerala-dining'])
  for (const photo of photos) {
    assert.match(photo.source, /^https:\/\/(unsplash\.com\/photos\/|www\.pexels\.com\/photo\/)/)
    assert.ok(photo.author)
    assert.match(photo.licence, /^(Unsplash License|Pexels License)$/)
    assert.ok(photo.location)
    assert.match(photo.licenceUrl, /^https:\/\//)
    for (const file of photo.files) {
      const bytes = readFileSync(`public/images/kerala/${file.file}`)
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP')
      assert.equal(bytes.length, file.bytes)
      assert.ok(bytes.length < 400000, file.file)
      assert.ok(file.width >= 640 && file.width <= 1920)
      assert.ok(file.height > 0)
    }
  }
})

test('Kerala visual stories credit images, reserve frames, avoid repeated scenes and preserve package content', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { keralaPackages, domesticPackagePath, KERALA_PRICING_CONDITIONS } = await server.ssrLoadModule('/src/data/domesticHolidays.js')
    const { keralaPhotography, packageHeroPhotography } = await server.ssrLoadModule('/src/data/keralaPhotography.js')
    assert.equal(new Set(Object.values(packageHeroPhotography)).size, 3)
    const render = path => renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App))).replaceAll('<!-- -->', '')
    const paths = ['/domestic-holidays', '/domestic-holidays/kerala', ...keralaPackages.map(domesticPackagePath)]
    for (const path of paths) {
      const html = render(path)
      const images = [...html.matchAll(/<img\b[^>]*src="(\/images\/kerala\/[^"]+)"[^>]*>/g)]
      assert.ok(images.length > 0)
      assert.equal(new Set(images.map(image => image[1])).size, images.length, `${path}: unique photo scenes`)
      for (const [tag, src] of images) {
        assert.match(tag, /width="\d+"/)
        assert.match(tag, /height="\d+"/)
        assert.match(tag, /alt="[^"]+"/)
        assert.match(tag, /srcSet="[^"]+640w/)
        readFileSync(`public${src}`)
        const photo = Object.values(keralaPhotography).find(item => item.src === src)
        assert.ok(photo)
        assert.ok(html.includes(photo.source.replaceAll('&', '&amp;')), photo.source)
      }
    }
    for (const pkg of keralaPackages) {
      const html = render(domesticPackagePath(pkg))
      assert.ok(html.includes(pkg.price))
      assert.ok(html.includes(keralaPhotography[packageHeroPhotography[pkg.tier]].src))
      const hero = html.match(/<figure class="kerala-photo kerala-detail-hero[^>]*>[\s\S]*?<\/figure>/)?.[0]
      assert.ok(hero?.includes(keralaPhotography[packageHeroPhotography[pkg.tier]].src))
      assert.ok(!hero.includes(`src="${pkg.image}"`), 'Legacy hero selection must not override reviewed photography')
      assert.ok(html.includes(`${pkg.days} Days / ${pkg.nights} Nights`))
      for (const condition of KERALA_PRICING_CONDITIONS) assert.ok(html.includes(condition))
      assert.equal((html.match(/<span class="eyebrow">Day /g) || []).length, pkg.days)
      assert.match(html, /loading="lazy"/)
      if (pkg.tier === 'Signature') assert.match(html, /Your included Ayurvedic relaxation massage/)
      assert.doesNotMatch(html, /ayurveda-setting|generic spa|Cocobay|kumarakom-resort\.webp|thekkady-cardamom\.webp|Book Now|Pay Now/)
    }
  } finally { await server.close() }
})
