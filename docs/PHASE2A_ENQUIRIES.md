# Phase 2A: email-first enquiries (local replacement)

This branch, `feature/email-first-enquiries`, starts from `772438f7da1cfdcca0f7c5937de1eba1e807e489`. The original Phase 2A branch, Draft PR #3 and its Forms-based preview remain unchanged. No email-first commit, push, deployment or provider setup has been performed.

The eight services, context handoffs, package references, validation, acknowledgement and design are preserved. Contact sends JSON to `/api/enquiries`, a Netlify Function which independently validates and gates sending before calling Resend. Static Netlify Forms registration has been removed from this branch. Old hosted forms, if any, are not removed by a local HTML change.

The endpoint is disabled. Privacy remains `approved: false`, notice version `email-first-draft-1`, with no effective date. Resend account, credentials and sender verification are not configured. There is no application customer database, queue, payment collection, document upload or customer auto-response.

Loading, errors, preserved input and duplicate-click protection remain. Success requires structured email-provider acceptance, not bare HTTP success or a Vite HTML response. Acceptance is not proof of inbox delivery and is not a booking confirmation.

The owner remains the sole operator, with weekly manual review, an ordinary 90-day retention target after last relevant communication, booking/ongoing-enquiry/legal/accounting/dispute exceptions and separate promotional-marketing permission. Provider content/log retention requires review.

See [EMAIL_FIRST_ENQUIRIES.md](EMAIL_FIRST_ENQUIRIES.md) for configuration, limits, DNS/provider prerequisites and isolated testing. See [ENQUIRY_RETENTION_PROCEDURE.md](ENQUIRY_RETENTION_PROCEDURE.md) for the manual procedure. Neither document authorizes activation or deletion.
