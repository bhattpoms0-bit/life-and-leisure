# LUXE VOYAGE — Build Brief for Claude Code

## Goal
Turn the Stitch design mockups in `design-reference/` into a real, working
multi-page website called **LUXE VOYAGE** (luxury travel agency), matching
the UI/UX exactly: same layout, colors, typography, spacing, and micro-interactions.

## Your original 7 Stitch HTML exports
Copy your original downloaded Stitch HTML files into `design-reference/mockups/`
before starting (one per page: home, destinations, hotels, package-detail,
visa, flights). Claude Code should treat these as the pixel-accurate source
of truth for markup/classes — `design-reference/PAGE_INVENTORY.md` and
`design-reference/design-tokens.js` summarize what's in them so you don't have
to re-read every file for every task.

## Tech stack
- **React 18 + Vite** (fast local dev, matches component-based reuse of nav/footer/cards)
- **React Router v6** for the 6 pages
- **Tailwind CSS**, configured with `design-reference/design-tokens.js` merged into
  `tailwind.config.js` (colors, spacing, fontSize, fontFamily, borderRadius — copy as-is)
- **Material Symbols Outlined** font + **Plus Jakarta Sans** via Google Fonts link in `index.html`
- Plain `useState`/`useEffect` — no extra state library needed for a marketing site

## Project structure
```
src/
  components/
    layout/TopNav.jsx
    layout/Footer.jsx
    ui/GlassSearchBar.jsx
    ui/DestinationCard.jsx
    ui/HotelCard.jsx
    ui/StarRating.jsx
    ui/SectionHeading.jsx
  pages/
    Home.jsx
    Destinations.jsx
    Hotels.jsx
    PackageDetail.jsx
    Visa.jsx
    FlightResults.jsx
  data/
    destinations.js      // mock data extracted from mockups (Maldives, Bali, Venice, Thailand, Russia, Switzerland, Vietnam, Singapore, Japan, China)
    hotels.js
    flights.js
    testimonials.js
  App.jsx                // routes
  main.jsx
  index.css              // @tailwind directives
```

## Build order (do this incrementally, verify each step in the browser before moving on)
1. `npm create vite@latest . -- --template react` then install Tailwind + React Router
2. Wire up `tailwind.config.js` with the design tokens file
3. Build `TopNav` and `Footer` first — they're on every page, get them pixel-accurate once
4. Build shared `ui/` components (cards, star rating, glass search bar) — used across 3+ pages
5. Build pages in this order: Home → Destinations → Hotels → PackageDetail → Visa → FlightResults
6. Wire up React Router in `App.jsx`, make nav links actually navigate
7. Port over the interaction details listed in `PAGE_INVENTORY.md` (scroll shrink nav, reveal-on-scroll, accordion, filter pill toggle, ripple) as small custom hooks or inline handlers
8. Replace all mockup image URLs (`lh3.googleusercontent.com/aida-public/...`) with either
   the same URLs (they're public Stitch-hosted asset URLs and may work as-is) or your own
   images / Unsplash placeholders — flag this for me to review, don't silently swap without noting it

## Explicitly out of scope for now (mock/stub it)
- Real booking/payment flow — buttons should be wired up (onClick, form state) but can log
  to console or navigate to a "coming soon" state
- Real flight/hotel search API — use the `data/*.js` static arrays from the mockups
- Auth — account icon can just be a placeholder link for now

## What "done" looks like
All 6 routes render, nav works between them, layout matches the mockups at
desktop (1280px) and mobile (375px) widths, and the shared header/footer are
identical across every page.
