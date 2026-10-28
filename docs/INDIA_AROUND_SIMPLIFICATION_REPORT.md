# India & Around simplification — approved release scope

## Repository safety

Repository: `https://github.com/bhattpoms0-bit/life-and-leisure.git`.

Fetched and verified latest `origin/main`: **95d3bbab773bcd450fba5b694c76ea082d143dc4**. HEAD is based on that SHA. Read the existing `CLAUDE.md`; no checkout AGENTS.md was found. The current user brief governs the existing Life & Leisure site.

Release branch: **feature/phase3c-goa-holidays**, the existing feature branch requested for finalisation. The owner visually reviewed and approved the local simplification. The checkout also contains separate uncommitted Goa work. That work is excluded from this release: Goa routes, data, photographs, Contact changes and styles remain local. The approved files are staged explicitly, with the shared stylesheet staged without the Goa additions. No stash, reset or movement of unrelated work is required.

## Result

- Removed Domestic Holidays from the shared Holidays dropdown data, updating desktop and mobile together. International Holidays remains linked to `/packages`, and the dropdown still opens normally. All top-level navigation items remain, including India & Around at `/#discover-india`.
- Removed the complete “Domestic holidays · introducing Kerala / A little closer. / Just as extraordinary.” homepage banner, its component, image placement and CTA buttons. Removed its `.domestic-home` styling and selector branches while retaining shared `.kerala-hero` rules and all package styling.
- Homepage India & Around now has exactly four destination cards, in the required order. It uses four columns at 1024px and above, two on tablet, and one below 480px with landscape image crops and readable status text.
- Removed Kashmir, Rajasthan, Bhutan and Himachal Pradesh from the visible destination array. Their stored photographs and rights records remain untouched; no package data or routes elsewhere were deleted.
- Preserved the four Jaipur, Ranthambore, Munsiyari and Udaipur bespoke India experiences inside the existing accessible disclosure, including their photographs and inbound India Contact handoffs.

| Order | Card | Status | Homepage card link |
| --- | --- | --- | --- |
| 1 | Northeast India, renamed from Seven Sisters | Coming Soon | None |
| 2 | Goa | Coming Soon | None |
| 3 | Kerala | 3 Packages Available | `/domestic-holidays/kerala` |
| 4 | Nepal | Coming Soon | None |

Nepal remains explicitly identified as an international destination. Separate local Goa work is preserved but is not part of this PR; its homepage card is not promoted or linked until approved. The existing `/domestic-holidays` overview, footer link and Kerala breadcrumbs remain; the requested navigation removal concerns the main Holidays dropdown.

## Photography and attribution

All four approved photographs are retained byte-for-byte, including the original Seven Sisters living-root-bridge photograph now labelled Northeast India. Existing internal Pexels/Unsplash rights records remain. The four displayed photographs do not require public attribution, so no source labels are displayed.

The removed Bhutan card's photograph and its attached mandatory CC BY-SA credit are removed from the rendered section together. Its files, source record, licence information and the generic mandatory-credit rendering safeguard remain. No credit was detached from a still-displayed restricted image. The former visible Bhutan attribution conflict recorded in the earlier Goa audit therefore no longer applies to the current homepage. There is no unresolved attribution conflict for the four retained cards.

## Exact files changed for this task

Modified:

1. `src/data/navigation.js` — dropdown item removal.
2. `src/pages/Home.jsx` — promotional section and import removal.
3. `src/data/indiaAround.js` — four-card selection, order, rename and availability.
4. `src/components/ui/DiscoverIndia.jsx` — accurate responsive image sizes and updated collection note.
5. `src/index.css` — section-only style cleanup and responsive four-card layout.
6. `tests/indiaAround.test.js` — new card/navigation/banner expectations plus existing asset and handoff coverage.
7. `docs/INDIA_AND_AROUND.md` — current presentation and attribution notes.

Deleted:

8. `src/components/ui/DomesticHolidaysSection.jsx` — obsolete homepage-only banner component.

Added:

9. `scripts/india-around-browser-qa.mjs` — repeatable local responsive/navigation/handoff checks using an already installed Playwright package; no dependency changes.
10. `docs/INDIA_AROUND_SIMPLIFICATION_REPORT.md` — this report.

This is the exact release inventory. Other files shown by `git status` belong to the preserved, earlier Goa implementation and must not be included in the commit. Existing Kerala page photography credit behaviour remains unchanged in this release; only optional credits within the approved homepage section are suppressed.

## Validation

- Lint: `npm.cmd run lint` — passed.
- Guarded non-production build: invoked the existing `checkEnquiryRelease` with an explicit `deploy-preview` context, then ran `npm.cmd run build` — passed. No environment variables or activation settings were changed. The exact staged tree was validated separately from the mixed working copy.
- Automated release tests: `node --test tests/*.test.js` against the isolated staged tree — **65 passed, 0 failed**. The prior mixed-copy review passed 66 tests, including one separate Goa test; that Goa test is excluded from the release. Existing Kerala pricing/itineraries, all twelve international routes/prices, validation, mocked email delivery, privacy and release safeguards pass.
- `git diff --check` — passed. Git's Windows LF/CRLF notices are informational.
- Browser QA against the built local site at **320, 375, 768, 1024 and 1440px** — passed. Verified exact card names/order/statuses, only Kerala linked, no banner, no Domestic Holidays dropdown item, working India & Around and International Holidays navigation, and the Kerala collection and three package pages.
- Browser verified **20 bespoke India Contact handoffs**, **15 Kerala Contact handoffs**, plus all **12 international detail routes and their Contact handoffs**. Existing service selection and destination context survived each handoff.
- Retained destination and bespoke photographs decoded successfully. No horizontal overflow, console errors or JavaScript exceptions. Reviewed responsive screenshots for card crops, spacing, typography and disclosure placement.
- Internal browser screenshots, viewport metrics and test results are in ignored `simplification-qa.local/`. Run the browser helper against `vite preview --port 4173` with `node scripts/india-around-browser-qa.mjs <path-to-playwright/index.mjs>`.
- Pre-existing files outside the task allowlist compared against the start-of-task SHA-256 baseline: **0 unexpected changes**.
- Release-stage allowlist: exactly the ten files above. Staged credential-pattern review: **0 findings**. No environment files, private keys, backend changes or hosting configuration changes are included.

No Contact form was submitted. Browser QA blocks POST requests. No real emails were sent. Resend, validation, privacy, package prices, enquiry transport, dependencies and Netlify configuration were not edited.

## Release controls

Owner appearance approval has been received. Goa remains Coming Soon on the homepage pending separate approval. The owner has authorised committing this scope to the existing feature branch, pushing it and opening a PR targeting main. Do not merge or publish production. Do not change environment variables, the enquiry backend, privacy or Netlify release settings. Keep automatic production publishing locked. Inspect any automatically created Deploy Preview through GitHub checks without activating or changing hosting configuration.
