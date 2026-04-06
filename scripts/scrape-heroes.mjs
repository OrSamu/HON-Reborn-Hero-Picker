/**
 * HON:Reborn Hero Image Scraper — Puppeteer edition
 * --------------------------------------------------
 * Loads the JS-rendered learnatorium/heroes page with a real Chromium browser,
 * extracts every hero portrait, and saves them to public/heroes/.
 *
 * Usage:
 *   node scripts/scrape-heroes.mjs           # skip already-downloaded
 *   node scripts/scrape-heroes.mjs --force   # overwrite all
 *   node scripts/scrape-heroes.mjs --dry-run # print URLs, don't download
 */

import puppeteer          from 'puppeteer'
import { createWriteStream, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { pipeline }       from 'stream/promises'
import path               from 'path'
import { fileURLToPath }  from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const OUT_DIR   = path.join(ROOT, 'public', 'heroes')
const DATA_FILE = path.join(ROOT, 'src', 'data', 'heroes.json')

mkdirSync(OUT_DIR, { recursive: true })

const FORCE   = process.argv.includes('--force')
const DRY_RUN = process.argv.includes('--dry-run')
const HON_URL = 'https://heroesofnewerth.com/learnatorium/heroes'

// ─── Load our hero DB ──────────────────────────────────────────────────────
const { heroes } = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))

// Build lookup: normalized name → hero id
// e.g. "Witch Slayer" → "witch-slayer", "Necro'lic" → "necro-lic"
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/['''`]/g, '')       // remove apostrophes
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '')   // strip remaining non-alphanum
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '')        // trim leading/trailing hyphens
}

const nameToId = new Map()
for (const h of heroes) {
  nameToId.set(normalizeName(h.name), h.id)
  // Also index without "the-" prefix so "the-madman" → matches "madman" variants
  const withoutThe = h.id.replace(/^the-/, '')
  if (withoutThe !== h.id) nameToId.set(withoutThe, h.id)
}

// ─── Download helper ────────────────────────────────────────────────────────
async function downloadUrl(url, destPath) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const ct = resp.headers.get('content-type') ?? ''
  if (!ct.startsWith('image/')) throw new Error(`Not an image: ${ct}`)
  await pipeline(resp.body, createWriteStream(destPath))
}

function extFromUrl(url) {
  const u = url.split('?')[0]
  const m = u.match(/\.(webp|jpg|jpeg|png|gif|avif)$/i)
  return m ? m[1].toLowerCase() : 'jpg'
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🎮  HON:Reborn Hero Image Scraper (puppeteer)')
  console.log(`📁  Output : ${OUT_DIR}`)
  console.log(`🌐  Source : ${HON_URL}`)
  if (FORCE)   console.log('⚠️   Force mode — overwriting existing files')
  if (DRY_RUN) console.log('🔍  Dry-run mode — no files will be written')
  console.log()

  // ── Launch Chromium ────────────────────────────────────────────────────
  console.log('🚀  Launching browser…')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  // ── Capture image requests made by the page ────────────────────────────
  const capturedImages = new Map() // heroName → imgUrl

  page.on('response', async (response) => {
    const url  = response.url()
    const type = response.headers()['content-type'] ?? ''
    if (!type.startsWith('image/')) return
    if (url.includes('google') || url.includes('analytics') || url.includes('favicon')) return

    // Try to extract a hero name from the URL
    // Common patterns: /HeroName/Portrait.jpg  or  /hero_name.webp  or  hero-name_portrait.jpg
    const urlPath  = new URL(url).pathname.toLowerCase()
    const segments = urlPath.split('/').filter(Boolean)
    for (const seg of segments) {
      const candidate = normalizeName(seg.replace(/portrait|icon|thumb|card|avatar|hero_?/gi, ''))
      if (candidate && nameToId.has(candidate)) {
        capturedImages.set(nameToId.get(candidate), url)
      }
    }
  })

  // ── Navigate and wait for content ─────────────────────────────────────
  console.log('🌐  Navigating to learnatorium…')
  try {
    await page.goto(HON_URL, { waitUntil: 'networkidle2', timeout: 30_000 })
  } catch {
    // networkidle2 sometimes times out on SPAs — keep going
    console.log('ℹ️   networkidle2 timeout (page probably loaded anyway)')
  }

  // Wait for any hero image to appear
  console.log('⏳  Waiting for hero images to render…')
  try {
    await page.waitForSelector('img[src]', { timeout: 15_000 })
    // Give JS a bit more time to render remaining cards
    await new Promise(r => setTimeout(r, 3000))
  } catch {
    console.log('⚠️   Timed out waiting for images — attempting extraction anyway')
  }

  // ── Extract hero data from DOM ──────────────────────────────────────────
  console.log('🔍  Extracting hero data from DOM…')
  const domHeroes = await page.evaluate(() => {
    const results = []

    // Strategy 1: find all <img> tags and nearby text (name)
    const imgs = Array.from(document.querySelectorAll('img[src]'))
    for (const img of imgs) {
      const src = img.src || img.getAttribute('src') || ''
      if (!src || src.startsWith('data:')) continue

      // Try to find associated hero name from alt, title, or nearby elements
      const name =
        img.alt ||
        img.title ||
        img.closest('[data-hero]')?.dataset.hero ||
        img.closest('[class*="hero"]')?.querySelector('[class*="name"],[class*="title"],h1,h2,h3,h4,span,p')?.textContent?.trim() ||
        ''

      if (src && src.length > 10) {
        results.push({ src, name: name.trim() })
      }
    }

    // Strategy 2: find hero card containers that have both an image and a text node
    const cards = Array.from(document.querySelectorAll(
      '[class*="hero"],[class*="card"],[class*="portrait"],[class*="champion"]'
    ))
    for (const card of cards) {
      const img  = card.querySelector('img[src]')
      if (!img) continue
      const src  = img.src || ''
      const name = (
        card.querySelector('[class*="name"],[class*="title"],[class*="label"]')?.textContent ||
        card.getAttribute('data-hero') ||
        card.getAttribute('data-name') ||
        card.getAttribute('aria-label') ||
        img.alt || ''
      ).trim()
      if (src) results.push({ src, name })
    }

    return results
  })

  console.log(`   Found ${domHeroes.length} image elements in DOM`)
  console.log(`   Captured ${capturedImages.size} image URLs via network intercept`)

  // ── Take a debug screenshot so we can see what loaded ──────────────────
  const screenshotPath = path.join(ROOT, 'scripts', 'debug-screenshot.png')
  await page.screenshot({ path: screenshotPath, fullPage: false })
  console.log(`📸  Debug screenshot saved to scripts/debug-screenshot.png`)

  // ── Also dump all img srcs found for manual inspection ─────────────────
  const allSrcs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img[src]'))
      .map(i => ({ src: i.src, alt: i.alt, cls: i.className }))
      .filter(i => i.src && !i.src.startsWith('data:'))
  )
  const manifestPath = path.join(ROOT, 'scripts', 'found-images.json')
  writeFileSync(manifestPath, JSON.stringify(allSrcs, null, 2))
  console.log(`📄  All found image URLs written to scripts/found-images.json`)

  await browser.close()
  console.log('🔒  Browser closed\n')

  // ── Build final map: heroId → imageUrl ─────────────────────────────────
  const toDownload = new Map() // heroId → url

  // Priority 1: network-intercepted URLs (most accurate)
  for (const [heroId, url] of capturedImages) {
    toDownload.set(heroId, url)
  }

  // Priority 2: DOM-extracted URLs matched by name
  for (const { src, name } of domHeroes) {
    if (!name || !src) continue
    const normalized = normalizeName(name)
    const heroId = nameToId.get(normalized)
    if (heroId && !toDownload.has(heroId)) {
      toDownload.set(heroId, src)
    }
  }

  // Priority 3: match by URL path segments against hero names
  for (const { src } of domHeroes) {
    const urlPath = src.toLowerCase()
    for (const [normalName, heroId] of nameToId) {
      if (urlPath.includes(normalName) && !toDownload.has(heroId)) {
        toDownload.set(heroId, src)
        break
      }
    }
  }

  console.log(`🗺️   Matched ${toDownload.size} heroes to image URLs`)
  if (toDownload.size === 0) {
    console.log('\n❌  No hero images matched!')
    console.log('   Open scripts/found-images.json to see what images were found.')
    console.log('   Open scripts/debug-screenshot.png to see what the page looks like.')
    console.log('   The page might need more time to load, or selectors may need updating.\n')
    return
  }

  // ── Download ─────────────────────────────────────────────────────────────
  let downloaded = 0, skipped = 0, failed = 0, unmatched = 0

  // Show unmatched heroes
  for (const hero of heroes) {
    if (!toDownload.has(hero.id)) unmatched++
  }

  console.log('⬇️   Downloading images…\n')
  for (const hero of heroes) {
    const url = toDownload.get(hero.id)
    if (!url) {
      console.log(`❓  ${hero.name.padEnd(28)} — no URL found`)
      continue
    }

    const ext      = extFromUrl(url)
    const destPath = path.join(OUT_DIR, `${hero.id}.${ext}`)
    const label    = hero.name.padEnd(28)

    if (!FORCE && existsSync(destPath)) {
      console.log(`⏭️   ${label} — already exists`)
      skipped++
      continue
    }

    if (DRY_RUN) {
      console.log(`🔍  ${label} — ${url}`)
      downloaded++
      continue
    }

    try {
      await downloadUrl(url, destPath)
      console.log(`✅  ${label} — ${ext.toUpperCase()}`)
      downloaded++
    } catch (err) {
      console.log(`❌  ${label} — ${err.message}`)
      failed++
    }

    // Be polite
    await new Promise(r => setTimeout(r, 150))
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────')
  console.log(`✅  Downloaded : ${downloaded}`)
  console.log(`⏭️   Skipped   : ${skipped}`)
  console.log(`❌  Failed     : ${failed}`)
  console.log(`❓  No URL     : ${unmatched}`)
  console.log('─────────────────────────────────────────────')

  if (unmatched > 0) {
    console.log('\n💡  For heroes with no URL:')
    console.log('   1. Check scripts/found-images.json for extra URLs')
    console.log('   2. Check scripts/debug-screenshot.png to see the page')
    console.log('   3. Add the image manually to public/heroes/<hero-id>.webp')
  }

  console.log('\n✨  Done! Restart npm run dev to see the images.\n')
}

main().catch(err => {
  console.error('\n💥  Fatal error:', err.message)
  process.exit(1)
})
