# LUXE VOYAGE — Page Inventory (from Stitch mockups)

Brand: **LUXE VOYAGE** — luxury travel agency. Font: Plus Jakarta Sans. Icons: Material Symbols Outlined.
Palette: deep navy primary (#002550), burnt-orange secondary (#994700 / #ff8429), warm off-white surfaces (#fcf9f8).

## Shared components (build these first, reuse everywhere)
- **TopNav** — fixed, glass/blur on scroll, logo left, 5 links center (Destinations / Packages / Visa / Services / Blog), search + account icons + "Book Now" button right. Active link gets an underline.
- **Footer** — 4-column grid: Brand blurb + social icons | Company links | Support/Legal links | Newsletter signup. Bottom bar with copyright + legal links.
- **Search/Booking glass card** — frosted-glass card with Destination / Dates / Travelers fields + CTA button. Appears (in variants) on Home hero, Hotel listing, Visa page.
- **Star rating** — filled Material Symbol stars, used on hotel cards, testimonials, package headers.
- **Destination/Hotel card** — image + location pill + title + description + price + CTA. Repeated pattern across Home, Destinations, Hotels.

## Pages

1. **Home (`/`)** — index.html
   - Hero: full-bleed image (Santorini pool), headline, subhead, floating glass search widget
   - Travel categories (4 icon tiles: Honeymoon, Adventure, Corporate, Group Tours)
   - Curated Destinations grid (3–6 cards: Maldives, Bali, Venice, Thailand, Russia, Switzerland)
   - "Unrivaled Standards" — 3 icon+text value props
   - Visa Assistance CTA banner (dark navy, split image/text)
   - Testimonials (2-up cards with avatar, star rating, quote)
   - Footer

2. **Destinations (`/destinations`)**
   - Editorial full-height hero (Ha Long Bay) with region tag
   - Sticky filter bar (region pills + type dropdown)
   - Destination grid (aspect-[3/4] hover cards, 6 countries: Thailand, Vietnam, Singapore, Japan, Russia, China)
   - Newsletter/consult CTA band

3. **Hotel Listing (`/hotels?destination=bali`)**
   - Compact hero with embedded glass search bar (destination/dates/guests prefilled)
   - Left sidebar filters: price range slider, star rating checkboxes, amenities checkboxes, small map thumbnail
   - Right: list/map toggle + sort dropdown + hotel result cards (image | rating/name/desc/amenity chips | price + CTA)

4. **Package Detail (`/packages/bali-bliss`)**
   - Full-bleed hero with package title, duration, rating
   - 2-col layout: Left = highlights text, icon feature row, bento image gallery, numbered itinerary timeline (day-by-day), "What's Included" checklist panel. Right = sticky booking card (price, date picker, passenger select, price breakdown, CTA)
   - Related packages carousel/grid (3 cards)

5. **Visa Assistance (`/visa`)**
   - Split hero: headline/subhead/search left, airport-lounge image right
   - 4-step process timeline (Consultation → Documents → Submission → Delivery)
   - Bento-grid documentation requirements (Passport / Photos / Financial Proof / Itinerary)
   - FAQ accordion (left = contact CTA card, right = `<details>` accordion list)
   - Dark CTA band with avatar stack ("Joined by 2,000+ travelers")

6. **Flight Search Results (`/flights/search`)**
   - Persisted search summary bar (origin/destination/date/guests + Modify button) on dark navy
   - Left sidebar: price range slider, stops checkboxes, airline checkboxes, promo banner card
   - Right: result count + sort, flight cards (airline logo, times/route/duration/stops, price w/ strikethrough, amenities footer strip), "Load more"
   - Concierge CTA band

## Notable interaction details already coded in the mockups
- Nav bar shrinks height + adds blur/shadow on scroll (`scroll` listener toggling classes)
- IntersectionObserver fade/slide-up reveal on section children (Home page)
- Ripple effect on button click (Flight results page)
- Accordion via native `<details>/<summary>` (Visa FAQ)
- Filter pill active-state toggling (Destinations page)
