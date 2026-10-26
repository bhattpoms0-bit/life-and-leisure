# Email-first enquiries: production preparation and operation

## Current state and authorization

The local release candidate retains all eight service workflows and the context corrections on `feature/email-first-enquiries`. Production-preparation changes were committed locally in `60fbf2cda448840de71b3628cedb4d56657e181e`. As of this documentation review, that commit has not been pushed, incorporated into Draft PR #4 or deployed to production; the existing visual preview remains disabled. Recheck remote, PR and deployed SHAs before each release; a local commit does not imply privacy approval or enquiry activation. Privacy is still `approved: false`, version `email-first-draft-1`, `effectiveDate: null`; no final version or effective date is assigned.

The owner reports that `mail.lifeandleisure.travel` is verified in Resend and has chosen `notifications@mail.lifeandleisure.travel` as sender. Account status, key restrictions, delivery, permissions, provider retention and billing limits still need owner verification. No credential is included or configured by this source change.

React Contact -> JSON POST `/api/enquiries` -> Netlify Function -> Resend -> `enquiries@lifeandleisure.travel`. No Netlify Forms registration/storage, customer database, CRM, document uploads, payment processing or automatic customer reply is introduced. The intended release contains only the normal enquiry function. The abandoned separate testing project/repository is untouched and is not part of this release.

## Privacy adoption and release guard

`src/lib/privacyAdoption.js` is shared by the build guard, runtime configuration and default UI availability. It requires Boolean approval `true`, a final version matching `email-first-v` followed by a positive integer (maximum 80 characters), and a real calendar effective date in `YYYY-MM-DD` format that is not in the future in Asia/Kolkata. This is a future naming convention, not approval or assignment of a policy version. The owner must approve the exact policy text/version/date together in a reviewed source change. Current draft values fail closed.

`node scripts/check-enquiry-release.mjs && npm run build` remains the Netlify build command; publish `dist`, functions `netlify/functions`, bundler `esbuild`. Production requires adopted privacy, explicit frontend/server activation, provider configuration, approved sender, and matching production site/context. Missing or malformed configuration blocks the build. The function checks the same adopted notice at runtime and validates each request's acknowledgement and exact notice version. No client payload or environment variable can approve privacy. A direct Vite build alone does not execute the release guard.

## Production environment variables - future owner action only

| Variable | Production value or source | Consumer |
| --- | --- | --- |
| `RESEND_API_KEY` | Owner-held sending-only key restricted to `mail.lifeandleisure.travel`; secret, never paste into Git, chat or logs | Function runtime; current build guard also checks presence |
| `RESEND_FROM_EMAIL` | Exactly `notifications@mail.lifeandleisure.travel` | Build guard and function |
| `EMAIL_ENQUIRY_TO` | Exactly `enquiries@lifeandleisure.travel` | Build guard and function; clients cannot select a recipient |
| `EMAIL_ENQUIRY_ENABLED` | `true` only after activation approval; otherwise absent/false | Build guard and function |
| `EMAIL_ENQUIRY_SITE_ID` | `bd40fa12-261f-4443-bb66-6d1862c38cf7`, verified original project UUID | Build guard and trusted runtime context |
| `EMAIL_ENQUIRY_CONTEXT` | `production` | Build guard and trusted runtime context |
| `EMAIL_ENQUIRY_ORIGIN` | `https://lifeandleisure.travel`, no trailing slash | Build guard and exact runtime origin checks |
| `VITE_ENQUIRY_INTAKE_ENABLED` | `true` only in the authorized production build; false/absent elsewhere | Public React UI and build guard |
| `VITE_NETLIFY_SITE_NAME` | Not needed for production; optional `lifeandleisure` for disabled visual-preview hostname matching | Public React UI only |
| `CONTEXT`, `SITE_ID` | Netlify-provided metadata; do not manually override | Build guard |

All server values must be available to Functions. The current guard also consumes them during Builds. Free-plan All scopes may be usable, but exposes values to trusted build code as well as runtime: a Secret label is not scope isolation. Never prefix a secret with `VITE_`, write it into `netlify.toml`, export it into generated files, print the environment, or expose it through errors. Vite exposes VITE variables; custom bundling/plugins can leak other values too. Scan release output and inspect dependencies/build scripts without printing real values.

Before provisioning any key, verify in Project configuration -> Environment variables that it has a Production-only value and no Deploy Preview, branch, preview-server, local-development, inherited/shared or branch-specific value. Do not set a universal fallback key. Verify the public-repository sensitive-variable policy withholds secrets from untrusted builds and restrict production access to trusted owners. Use available secret marking without assuming it blocks build code. If contextual isolation is unavailable or cannot be proven, the smallest no-paid-plan fallback is to disable all non-production deployment/build paths before provisioning a key and permit only reviewed production builds. Stop if that trust boundary cannot be enforced. Do not require a paid Functions-only scope for the plan; verify actual account options first.

Keep Netlify Forms detection disabled. Redirect `www` to the chosen canonical origin: the function accepts one exact origin. Variables declared only in `netlify.toml` are not runtime secret configuration. Runtime site and deploy context come from Netlify's trusted function context, not headers or the build-only CONTEXT value. Environment changes require a new deployment; do not assume older deployments lose credentials.

## Payload, security and limitations

SchemaVersion 1 includes service, customer, active travel fields, additional requirements, metadata, privacy notice version and honeypot. See ENQUIRY_CONTEXT.md for constrained group/CTA metadata, original/current destination labels and switching behavior. Source/package metadata is unverified context, not analytics or booking authority.

POST-only exact route, uncompressed JSON, optional UTF-8 charset, streaming 24 KiB request limit, allowlisted fields, all eight service validations, required acknowledgement, validated Reply-To, fixed sender/recipient, escaped HTML and plain text remain. No arbitrary headers or attachments are accepted. Customer email is Reply-To only. Origin checks are defense in depth, not authentication: direct clients can spoof them. No CAPTCHA or durable global quota is implemented.

Reference `LL-<client UUID>` and browser timestamp survive identical retries. Timestamp tolerance is 24 hours old/five minutes future; it is labelled browser-supplied, not authoritative server receipt. Service changes reset it. Idempotency uses UUID plus canonical-payload SHA-256; Resend's window is 24 hours, not permanent exactly-once delivery. Changed data, fresh IDs or later requests can duplicate emails.

The form locks concurrent clicks and accepted submissions. The provider request has a ten-second timeout, no automatic retries and no redirects. Structured provider acceptance is required; success explicitly does not guarantee inbox delivery or confirm a booking. Network uncertainty may occur after provider acceptance: inspect records before retrying. There is no durable delivery queue or application copy to recover a lost message from.

The function declares five requests per IP/domain per 60 seconds. Check deployment post-processing logs for rule acceptance before relying on it. Platform enforcement can lag, and distributed clients can evade per-IP controls. Review actual Netlify/Resend quotas, alerts and billing; do not assume free usage is unlimited. The code logs no request bodies, customer information, API keys or provider exception details; platform/provider records still require review.

## Approval and deployment sequence

1. Review the final policy text, processing basis, provider terms/locations, access/deletion controls and separate retention schedules. Adopt an exact notice version/effective date only after explicit owner approval.
2. Review the source changes and run lint, guarded preview build, tests, whitespace and secret scans. Obtain separate commit/push/PR/merge/release authorization. Do not enable preview sending.
3. Owner verifies the Resend domain, sending-only domain-restricted key, Workspace mailbox access/forwarding/spam handling, optional tracking settings, quotas and rollback capability. Do not alter root MX, DNS or Workspace as part of this source work.
4. After separate authorization, configure Production-only values, approve the reviewed release and let the production build guard run. A failed build must leave the previous published deployment in place.
5. Verify the actual deployed SHA, canonical domain, final policy, one normal enquiry function, routing and accepted rate-limit rule. Never publish a disabled preview as a shortcut around the guard.
6. Immediately after the separately authorized launch, the owner submits one clearly labelled verification enquiry through the normal form using a personal email. This is real personal information and follows the adopted privacy/retention process. No separate testing infrastructure is required. Other visitors may submit as soon as intake opens.
7. Record the request reference, inspect Resend acceptance/delivery events and confirm Workspace receipt including Spam/quarantine if needed. Verify From, To, Reply-To and the entered requirements. Provider acceptance alone is not receipt. Inspect an uncertain result before making another attempt; do not repeatedly submit.

## Failure, rollback and first-day monitoring

If delivery cannot be confirmed promptly, suspend intake and investigate provider events, Function status and Workspace filtering. Show the official email alternative without claiming receipt. For duplicate messages, reconcile references/idempotency before retrying. Preserve only minimal diagnostics; do not log message bodies or credentials.

A dedicated Resend key can be revoked by the owner to block future provider authorization across deployments using it. This is the fastest sending cutoff for credential exposure or serious abuse, but does not cancel emails already accepted. Changing a flag, restoring an older production deployment or closing a PR does not revoke all older deploy URLs. After separately authorized cutoff, disable activation, build/deploy a disabled release, verify it and review accessible older deployments. Rotate a compromised key only after investigation and re-establishing isolation. Use the known-good production deployment as the UI rollback reference; do not rewrite main history.

For the first 24 hours monitor Function errors/429s, Resend failures/bounces, Workspace receipt, duplicates, spam, quotas/costs and customer complaints. Pause intake for suspected incidents and use the business mailbox for responses. During week one review daily and perform the first weekly retention review. At one month review access, usage, delivery, exceptions and the first upcoming 90-day due dates. Full retention-cycle verification cannot be claimed before it occurs.

## Privacy operations

See ENQUIRY_RETENTION_PROCEDURE.md: one owner/operator, weekly manual reviews, ordinary enquiries generally up to 90 days after last relevant customer communication, and separate booking/accounting/legal/dispute/ongoing-enquiry holds. No automatic deletion or marketing subscription exists. Provider content/log retention, backups, privacy requests and deletion limitations must be verified and recorded. The owner must approve the private register location and its own retention. Verification emails and their provider records need the same documented review; no deletion is authorized here.

## Primary references

- https://docs.netlify.com/build/environment-variables/overview/
- https://docs.netlify.com/build/environment-variables/secrets-controller/
- https://docs.netlify.com/build/functions/environment-variables/
- https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/docs/dashboard/api-keys/introduction
- https://resend.com/docs/dashboard/emails/idempotency-keys
