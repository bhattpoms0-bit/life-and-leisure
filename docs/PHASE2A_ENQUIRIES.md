# Phase 2A: assisted travel enquiries

Status: IMPLEMENTED / TESTED LOCALLY. Actual storage REQUIRES NETLIFY PREVIEW TESTING. Privacy and activation REQUIRES BUSINESS APPROVAL. No deployment, notification, billing or DNS configuration has been performed.

## Architecture and workflow

The homepage ServiceSelector and canonical Contact page share `EnquiryFields` and the service schema in `serviceEnquiry.js`. The homepage hands structured route state to `/contact`; it does not send customer information itself. Package, India experience, destination, tailor-made and visa actions use the same intake. Package prices and Phase 1 assets are unchanged.

Seven validated service identifiers: `flights`, `hotels`, `trains`, `visa`, `holidays`, `tailor_made`, `inbound_india`. Contact details, travel details and metadata are separate objects. Switching services retains a separate in-memory travel draft for each service and submits only the active service's fields. No localStorage, document uploads, payments, customer accounts or staff workflow fields are implemented.

Contact requires full name, email, service-specific requirements and an unchecked privacy acknowledgement. Phone, residence country and additional requirements are optional. Holidays include a separate budget currency. Other optional budgets require currency when provided. Multi-city flights support two to five legs. Optional hotel preferences can be entered in additional requirements.

`enquirySubmission.js` validates before requesting, allowlists the payload and uses `URLSearchParams` with `application/x-www-form-urlencoded` in a same-origin POST to `/`. `index.html` registers one hidden form, `life-leisure-enquiry`, with all 18 fields listed in `NETLIFY_FIELDS`. Structured travel JSON and a human-readable summary are both included. Netlify's received-at timestamp is authoritative; the client UUID is only a reconciliation aid, never a booking reference.

States: IDLE → VALIDATING → SUBMITTING → SUCCESS or ERROR. A synchronous lock prevents concurrent clicks; accepted submissions cannot be resent from the same mounted form. Failure preserves inputs and permits manual retry. A 30-second abort timeout avoids indefinite waiting. A timeout or lost response can still follow provider acceptance: staff must reconcile possible duplicates using the request ID. No automatic retries, strong deduplication or server rate limiter are claimed.

Only a successful HTTP response produces the requested acknowledgement, which explicitly says this is not a booking confirmation. Network errors and non-success responses show the requested uncertainty message. A successful response is provider acceptance, not proof of inbox notification or independently verified storage. Spam filtering may discard a request. The dashboard check below is essential.

## Validation and admission limits

JavaScript validation covers required fields, single-line strings, lengths, email shape, optional phone format (7–15 digits), service enums, supported options, integer passenger/guest counts (1–20) and rooms (1–10). Calendar dates must be real and today or later; return flights, hotel checkout and inbound departure must follow their starting date. Multi-city dates cannot go backwards. Holiday months must be current or later. Additional requirements are limited to 5,000 characters. Errors are associated with inputs; a focusable status summary announces the result. HTML constraints supplement these checks.

Static and rendered forms both contain the hidden `bot-field` honeypot; the AJAX payload includes its value. The hidden control is excluded from normal keyboard and screen-reader interaction. Netlify supplies its built-in spam filtering. No CAPTCHA or new dependencies were added.

These are client-side checks, not a trusted server schema. A direct POST can bypass them, submit arbitrary values, spoof context and privacy acknowledgement, or add public fields. The application never consumes public status/assignment/internal-note values as staff authority. Staff must treat all submitted content as untrusted, verify package identifiers against the actual catalogue, and avoid interpreting free text as commands or spreadsheet formulas. Netlify Forms is not a booking system, secure document portal or CRM. If enforced business validation, durable idempotency or stronger abuse controls become necessary, assess a small server-side intake separately with approval.

## Privacy approval and release block

`src/data/enquiryConfig.js` contains the exact proposed acknowledgement wording and version `phase2a-draft-1`. It explains enquiry-response use, processing with Netlify Forms, no marketing subscription and no sensitive documents. It is visibly marked as proposed in local review. No standalone unapproved privacy policy has been published.

Before approval, the business must confirm its legal identity/contact channel, applicable privacy obligations, lawful processing, Netlify processor/data-location terms, who has access, retention/deletion period and how customers exercise rights. Final wording and any approved privacy-page link must reflect those decisions. Marketing consent is not collected or bundled.

`PRIVACY_NOTICE.approved` is false. Intake also requires the public build flag `VITE_ENQUIRY_INTAKE_ENABLED=true` and an approved Netlify or company hostname. The flag is not a secret. Localhost cannot show provider acceptance based on a Vite response. The form is disabled while approval is pending; no submission is attempted.

`netlify.toml` runs `node scripts/check-enquiry-release.mjs && npm run build` and publishes `dist` from the repository root. Under Netlify `CONTEXT=production`, the guard fails until privacy approval and explicit intake activation are both present. This blocks the repository's normal production build, not arbitrary manual uploads or someone bypassing its command. Do not bypass it. The existing public SPA rewrite is unchanged. Local `npm.cmd run build` remains available for review.

## Required future dashboard checks (no settings changed)

1. Verify repository/branch and this build command, root base, `dist` publish directory, and Netlify's build context. Keep production at approved Phase 1 until release approval.
2. Confirm the exact plan in team **Usage & billing → Billing details → Plan**. Do not infer unlimited submissions from newer credit-based plans.
3. After privacy approval and explicit preview authorization, enable form detection if needed in project **Forms**. Set the public intake flag only for the approved Deploy Preview context initially. Rebuild that preview so static registration is processed; check that `life-leisure-enquiry` appears with expected fields. Some form-processing settings are site-wide: review their scope before changing them.
4. Review who can access submissions and agree retention, deletion and incident handling. Do not add credentials to frontend code.
5. Configure the one central staff notification inbox separately in Phase 2B. There is no notification delivery guarantee in this phase, so staff must review Forms directly once intake is enabled.

## Plan, allowance and monitoring

Official Netlify documentation reviewed 2026-10-24 lists **100 submissions per site/month** for Free/Starter Legacy plans. The precise account classification is still unverified. Netlify says **Forms → Usage** tracks verified submissions across all forms for the current billing period. Credit-based plans have different rules; do not apply their unlimited-forms policy to an unverified Legacy account.

The Legacy billing FAQ warns that reaching 100% of a non-build metered Free limit can disable builds and pause **all sites on the account**. Do not treat excess enquiries as merely rejected or assume a free reset restores service. Paid plans can automatically increase usage levels; do not upgrade or enable billing without separate approval.

Assign one of the 1–2 staff as usage owner and one backup. Record billing-period end, count and remaining allowance weekly, twice weekly at 50/100, daily at 75/100. At 90/100, immediately ask the owner to decide whether to suspend intake before exhausting the quota or approve a separately costed alternative. These are monitoring thresholds, not implemented automated caps. Disabling the client button is not a server-side quota cap and cannot block direct POST abuse. Include all forms and approved synthetic preview submissions in monitoring. Do not mass-submit test data. At growing volume, compare a suitable Netlify plan and a separately reviewed server-side intake; no service has been purchased.

Sources:

- [Official Forms setup and AJAX registration](https://docs.netlify.com/manage/forms/setup/)
- [Built-in spam filters and honeypots](https://docs.netlify.com/manage/forms/spam-filters/)
- [Legacy plan allowances and plan identification](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/legacy-pricing-plans/)
- [Legacy Free limit consequences](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/billing-faq-for-legacy-plans/)
- [Forms usage and billing dashboard](https://docs.netlify.com/manage/forms/usage-and-billing/)

## Local checks and approved preview acceptance

Run `npm.cmd run lint`, `npm.cmd run build`, then `node --test`. The build must precede tests that inspect `dist/index.html`. Existing route SSR tests and new pure validation/encoding/mock-provider tests make no real Netlify submissions. The release guard is tested separately for allowed previews and blocked production.

Browser interaction and Netlify storage have not been verified by these unit/SSR checks. After separate approval:

1. Review contact form at 325, 375, 390, 430, 768, 1024 and 1440px; keyboard labels, focus/status announcements, service switching, multi-city add/remove and error corrections.
2. Navigate from each homepage service, a real package, Discover India, destination and visa actions; check retained travel and package/experience context. Verify direct `/contact` refresh and back/forward navigation.
3. On the authorized Netlify preview only, submit one clearly marked synthetic enquiry using a business-controlled test email, no customer data. Inspect the network request for URL encoding and no premature success. Confirm a matching stored record in Forms, all 18 registered fields, travel JSON, package/experience context where relevant and provider timestamp. Do not infer storage from the HTTP status alone.
4. Test blocked/offline responses using browser tools and confirm values survive. Rapid-click once while a request is pending to verify only one request. Avoid repeated real submissions or consuming the entire free quota. Inspect spam filtering with provider documentation rather than mass-sending honeypot tests.
5. Confirm homepage, routes, logo, prices, India photo and credits remain visually intact. Review usage afterward. Email notifications remain a separate Phase 2B task.

Do not commit, push, merge, deploy or enable production intake until the owner approves the next step.
