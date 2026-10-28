// Run against the guarded local build served by `vite preview --port 4173`.
// Usage: node scripts/india-around-browser-qa.mjs <path-to-playwright/index.mjs>
import { pathToFileURL } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const { chromium } = await import(pathToFileURL(process.argv[2]).href)
const browser = await chromium.launch({ headless: true })
const output = 'simplification-qa.local'
await mkdir(output, { recursive: true })
const base = 'http://127.0.0.1:4173'
const checks = [], errors = []
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue())
  const open = async path => { await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' }); await page.locator('h1').waitFor() }
  for (const width of [320,375,768,1024,1440]) {
    console.log(`Review homepage, navigation and handoffs at ${width}px`)
    await page.setViewportSize({ width, height: 1000 })
    await open('/')
    await page.evaluate(async () => { await document.fonts.ready })
    const cards = page.locator('.india-around-card')
    assert.equal(await cards.count(), 4)
    assert.deepEqual(await cards.locator('h3').allTextContents(), ['Northeast India','Goa','Kerala','Nepal'])
    assert.equal(await page.locator('.domestic-home').count(), 0)
    assert.ok(!(await page.locator('body').innerText()).includes('A little closer.'))
    assert.equal(await page.locator('header a').filter({ hasText: 'Domestic Holidays' }).count(), 0)
    assert.equal(await cards.getByRole('link').count(), 1)
    assert.equal(await cards.getByRole('link').getAttribute('href'), '/domestic-holidays/kerala')
    assert.equal(await cards.getByText('Coming Soon', { exact: true }).count(), 3)
    assert.equal(await cards.getByText('3 Packages Available', { exact: false }).count(), 1)
    assert.equal(await page.locator('.india-around-credit').count(), 0)
    const toggle = page.locator('button[aria-controls="mobile-navigation"]')
    const mobile = await toggle.isVisible()
    if (mobile) await toggle.click()
    const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation', exact: true })
    await nav.getByRole('link', { name: 'India & Around', exact: false }).click()
    await page.waitForURL('**/#discover-india')
    await page.locator('#discover-india').scrollIntoViewIfNeeded()
    await cards.locator('img').evaluateAll(async images => { images.forEach(image => { image.loading = 'eager' }); await Promise.all(images.map(image => image.decode())) })
    const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, columns: getComputedStyle(document.querySelector('.india-around-grid')).gridTemplateColumns.split(' ').length }))
    assert.ok(metrics.scrollWidth <= width, `Homepage overflow at ${width}`)
    assert.equal(metrics.columns, width >= 1024 ? 4 : width >= 480 ? 2 : 1)
    await page.locator('#discover-india').screenshot({ path: `${output}/${width}-india-around.png` })
    await page.locator('#india-experiences summary').click()
    const experiences = page.locator('.india-card')
    assert.equal(await experiences.count(), 4)
    await experiences.locator('img').evaluateAll(async images => { images.forEach(image => { image.loading = 'eager' }); await Promise.all(images.map(image => image.decode())) })
    for (let i=0;i<4;i++) {
      if (i) { await open('/#discover-india'); await page.locator('#india-experiences summary').click() }
      const name = await page.locator('.india-card h3').nth(i).innerText()
      await page.locator('.india-card').nth(i).click()
      await page.waitForURL('**/contact')
      assert.equal(await page.locator('#service-type').inputValue(), 'inbound_india')
      assert.ok((await page.getByLabel('Destinations of interest in India', { exact: true }).inputValue()).length > 0)
      checks.push({ width, experience: name, handoff: 'passed' })
    }
    await open('/')
    if (mobile) await toggle.click()
    else await page.locator('.desktop-navigation .nav-dropdown').filter({ hasText: 'Holidays' }).locator('summary').click()
    await nav.getByRole('link', { name: 'International Holidays', exact: false }).click()
    await page.waitForURL('**/packages')
    await page.getByRole('heading', { name: 'International Holidays', exact: true }).waitFor({ state: 'visible' })
    await open('/domestic-holidays/kerala')
    assert.equal(await page.locator('.domestic-card').count(), 3)
    for (const slug of ['kerala-classic','kerala-serenity','kerala-private-luxury']) {
      await open(`/domestic-holidays/kerala/${slug}`)
      await page.getByRole('link', { name: /Enquire About This Trip/ }).click()
      await page.waitForURL('**/contact')
      assert.equal(await page.getByLabel('Destination', { exact: true }).inputValue(), 'Kerala, India')
      assert.equal(await page.locator('#service-type').inputValue(), 'holidays')
    }
    checks.push({ width, ...metrics, cards: 4, keralaHandoffs: 3, internationalNavigation: 'passed' })
  }
  const source = await readFile('src/data/packages.js', 'utf8')
  const slugs = [...source.matchAll(/slug: '([^']+)'/g)].map(match => match[1])
  assert.equal(slugs.length, 12)
  for (const slug of slugs) {
    console.log(`Preserved international route: ${slug}`)
    await open(`/packages/${slug}`)
    await page.getByRole('link', { name: /Enquire About This Trip/ }).click()
    await page.waitForURL('**/contact')
    assert.equal(await page.locator('#service-type').inputValue(), 'holidays')
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ checks, internationalRoutes: slugs, errors }, null, 2))
  assert.deepEqual(errors, [])
  console.log('PASS: all five viewports, four cards, navigation, 20 bespoke and 15 Kerala handoffs, 12 international routes/handoffs; no overflow, broken retained photos or console errors.')
} finally { await browser.close() }
