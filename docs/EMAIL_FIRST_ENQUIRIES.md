# Email-first enquiry intake: implementation and release checklist

## Current status and flow

Local branch `feature/email-first-enquiries` is based on `772438f7da1cfdcca0f7c5937de1eba1e807e489`. The original feature branch, Draft PR #3 and production are untouched. No provider account, credentials, verified sender, DNS or Workspace change is assumed. Nothing has been deployed or activated.

React Contact -> JSON POST `/api/enquiries` -> Netlify Function -> Resend API -> official Google Workspace mailbox. No Netlify Forms storage or notifications, customer database, payment processing or automatic customer reply. Resend and Workspace may retain message content and metadata.

## Configuration (all values require separate authorization)

| Variable | Required value/use |
| --- | --- |
| `RESEND_API_KEY` | Server-only sending key restricted to verified sender domain; never `VITE_` |
| `RESEND_FROM_EMAIL` | Bare address on an owner-verified sending domain |
| `EMAIL_ENQUIRY_TO` | Exactly `businessDetails.email`; never a customer-selected recipient |
| `EMAIL_ENQUIRY_ENABLED` | Literal `true`, after activation approval |
| `EMAIL_ENQUIRY_SITE_ID` | Authorized Netlify site UUID |
| `EMAIL_ENQUIRY_CONTEXT` | Exactly `deploy-preview` or `production`, matching trusted runtime context |
| `EMAIL_ENQUIRY_ORIGIN` | One exact HTTPS origin without a trailing slash; company production origin or authorized `deploy-preview-N--site.netlify.app` origin |
| `VITE_ENQUIRY_INTAKE_ENABLED` | Public UI switch; cannot independently authorize sending |
| `VITE_NETLIFY_SITE_NAME` | Actual isolated Netlify project slug, for frontend preview hostname matching |

Source `PRIVACY_NOTICE.approved` must also be approved for normal activation; it remains false. Requests must contain Boolean acknowledgement and the current notice version. No request can override approval or select another recipient.

Server variables need Functions scope. A future production build guard also needs provider/server configuration in Builds scope. Variables declared only in `netlify.toml` do not configure runtime secrets. Runtime authorization uses Netlify's trusted `context.site.id` and `context.deploy.context`, not a client header or the build-only `CONTEXT` variable. Never put keys in frontend imports, source control, VITE variables or logs. No environment file is created; `.env` files are ignored.

Build command: `node scripts/check-enquiry-release.mjs && npm run build`. Publish: `dist`. Functions: `netlify/functions`, esbuild bundler. Production build fails unless privacy, UI activation, server activation, provider configuration, production context and site ID are approved/matching. Local Vite and preview builds can succeed while the endpoint stays disabled. Manual upload can bypass build scripts; the independent runtime gate still applies.

## Payload and references

Fields: `schemaVersion`, `serviceType`, `customer`, `travel`, `additionalRequirements`, `metadata`, `privacyNoticeVersion`, `honeypot`. Unknown schema/contact/context/travel keys are rejected. Only selected-service fields reach the email. Package references are unverified catalogue context, never booking authority.

Reference: `LL-<client UUID>`. The browser creates a stable timestamp at the first attempt and retains it for retries. It is checked within a 24-hour age / five-minute future tolerance and labelled browser-supplied in email, not authoritative server receipt time. A changed service resets reference/time. Reload after a stale timestamp. Provider acceptance/receipt timestamps can be inspected separately.

Resend idempotency uses client UUID plus canonical-payload SHA-256. Same data and timestamp produce the same provider request/key; changed content produces a different key. The provider window is 24 hours, not permanent exactly-once delivery. Fresh IDs, changed content, or later retries can duplicate messages.

## Security and abuse controls

- POST only, custom `/api/enquiries` route; no cross-origin CORS permission.
- Uncompressed JSON only; optional UTF-8 charset. A 24 KiB byte limit is enforced during reading, including requests without Content-Length. Invalid JSON is rejected.
- Fixed server recipient/sender; customer email is validated Reply-To only. Subject comes from the service enum. HTML is escaped and plain text is provided. No attachments, arbitrary headers or remote email images are added.
- Server validation covers all eight services, required fields, lengths, dates/chronology, counts, currency, privacy version and honeypot. Server dates use Asia/Kolkata; the browser calendar uses local time, so the server is authoritative near timezone boundaries.
- Exact origin/host checks are defense in depth, not authentication: direct clients can spoof Origin. There is no synthetic-only restriction or CAPTCHA in this branch.
- Resend timeout: ten seconds; no automatic retries or provider redirects. Success requires a successful response containing an email ID. The browser also requires structured `accepted: true`, never merely HTTP 200. Provider acceptance is not confirmed inbox delivery.
- Application code logs no customer data, request bodies, keys or provider exceptions. Generic responses do not echo provider bodies. Platform logs, provider records and backups still need review.
- Function config requests a Netlify edge limit of five requests/domain/IP per 60 seconds. Verify it in deploy post-processing logs before relying on enforcement. Netlify can delay enforcement and invalid rules need not fail a deployment.

No durable global quota, custom fraud system or permanent deduplication store is implemented. Distributed IPs can evade per-IP controls. Lean initial protection: platform limit, restricted provider key, provider usage alerts, owner monitoring and a short test window. A strict global cap would need a separately approved atomic TTL counter (for example managed Redis) or a suitable platform/provider control; stronger bot protection could use a server-verified challenge. No such service is installed, purchased or assumed free. Client controls are not a public-endpoint security boundary.

## Resend setup and DNS prerequisites

1. Owner creates/verifies the provider account and reviews plan limits, processing terms/locations, subprocessors, access, retained messages/logs and deletion options.
2. Prefer a separately approved sending subdomain to isolate reputation. The exact subdomain and From address are owner decisions, not preconfigured identities.
3. Add the sender domain in Resend. Use ONLY its account-generated DNS records: DKIM and SPF/return-path verification, which may include MX at the sending/return-path subdomain. Do not invent selectors, region, names or values.
4. Do not replace Workspace root MX records or add a second SPF record at the same DNS name. Review existing SPF, DKIM and DMARC before any approved DNS change. Outbound sender verification is distinct from enabling inbound receiving. No Workspace SMTP password is needed.
5. Leave optional open/click tracking disabled unless separately reviewed; no provider settings have been configured here.
6. Create a narrow sending key and configure only the authorized site/context. Verify the sender before activating, without assuming example-domain credentials work.

## Privacy and retention

Draft version: `email-first-draft-1`; approval false, no effective date. Netlify hosting/serverless processing, proposed Resend sending, Workspace correspondence and existing Fonts/Material Symbols/Unsplash delivery are disclosed separately. No promise of zero provider retention, India-only storage, guaranteed inbox delivery or automatic deletion. One owner/operator, weekly review, ordinary 90-day enquiry retention and exceptions remain. Final policy, processing basis, provider review, actual controls and deletion handling require owner approval.

## Isolated testing (not authorized here)

Use a separately authorized project and testing branch/repository, not PR #3 or the production `lifeandleisure` project. Current source approval remains false and cannot send. A separately reviewed synthetic-only mechanism or actual privacy/activation approval is required; do not fake policy approval merely to run a test.

Run lint/build and mocked tests first. Review all eight services, context switching, keyboard/mobile UI and acknowledgement. After separate provider/DNS/activation/send authorization, send a minimal synthetic enquiry, match reference/provider ID to the Workspace message, inspect Reply-To without replying, and test duplicates/offline recovery without mass sending. Netlify Forms detection stays unnecessary/disabled. Function/email limits replace Forms submission limits; verify actual provider/account allowances.

Cleanup must cover Workspace, forwarded messages, attachments, exports and provider-retained content/logs. Do not assume a per-message erase button exists. Use the account's supported process or provider request, and document limitations. No record is deleted by automated tests.

## Primary references

- https://docs.netlify.com/build/functions/api/
- https://docs.netlify.com/build/functions/environment-variables/
- https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/
- https://docs.netlify.com/resources/troubleshooting/request-chain/
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/security/gdpr
