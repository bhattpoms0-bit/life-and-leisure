# Email-first enquiry retention procedure - pending final policy approval

Owner-confirmed commitments: one operator (the business owner), weekly manual review, ordinary enquiries generally retained up to 90 days after the last relevant customer communication, and separate permission for promotional marketing. Privacy remains false, no effective date is assigned, online intake is disabled, and provider access/deletion processes have not been operationally or independently verified. No data has been accessed or deleted by this implementation.

## Ownership and register

The owner manages Google Workspace correspondence and any transactional-email provider records needed for enquiry handling. Check account administrators, delegates, forwarding, connected apps, provider keys and exports against owner-only routine access. This document changes no permissions and authorizes no extra operator.

Use an owner-approved private register, never the Git repository. Keep minimal reference/provider email ID, last relevant interaction date, review-due date, related thread reference, status, holds and known copies. Use the original received date if there is no later relevant customer communication; use Asia/Kolkata consistently. Due date is last relevant communication plus 90 calendar days. Opening mail, internal notes, automated acknowledgements, spam and promotional messages do not restart the clock. Do not copy full customer messages into the register.

## Weekly manual review

1. The owner reviews the register and related mailbox/provider records weekly. Include records due before the next review and prioritize overdue records. This is a manual target, not automatic erasure at an exact hour on day 90.
2. Reconcile latest relevant customer communication against the mailbox before applying the cutoff. Check duplicate references/messages and known copies.
3. Check active bookings, ongoing enquiries/quotations, legal obligations, accounting requirements, disputes and preservation instructions. Bookings, invoices, payment and transaction records require separate approved schedules, not automatic deletion based on enquiry age.
4. Record any exception's scope, reason, owner decision and next review date. Resolve uncertain legal obligations before deletion; do not apply indefinite holds by default.
5. For expired records without a hold, confirm the exact scope and identifiers. Do not create a new backup export before deletion.

## Cross-system deletion after separate authorization

- Google Workspace: review received enquiries, staff replies, quoted content, forwarded copies, attachments, duplicate threads, labels, trash and any account retention/Vault holds. Archiving is not deletion. Separate booking/held material from expired content; escalate uncertain mixed threads. Do not bypass preservation rules or promise immediate erasure from provider systems.
- Transactional provider (Resend): locate the reference/provider ID, inspect actual retained email content, delivery logs, metadata, suppression data and any exports. Use supported account controls or request provider assistance where available. Do not assume a delete API/button exists for sent messages or that the account's retention period is zero. Record provider limitations, pending requests and any automatically expiring records. Account/billing/security records may have separate requirements.
- Netlify: this branch does not use Forms storage or intentionally log request bodies. Review any platform logs/exports that may include technical metadata. Previously registered Forms records from older deployments, if any, require a separately authorized legacy-data review; local code changes do not delete those records.
- Exports/copies: review downloaded CSV files, spreadsheets, email exports, attachments, forwarded destinations, synced folders, recycle/trash and known local copies. Remove only approved expired data without disturbing retained records. Do not move a copy elsewhere to preserve it.
- Log minimal reference, last interaction/due date, systems checked, action date, operator, result, exceptions and outstanding copies. No full messages, credentials or document copies in the deletion log. Register/log retention and location still need owner approval.

Distinguish completed removal in business-controlled locations from provider retention, backups, trash or legal holds. Record unresolved items and follow-up dates rather than certifying unverifiable provider-wide deletion. No automated deletion job is implemented.

## Correction and deletion requests

The request channel is the official email in `businessDetails.js`. Verify identity proportionately through the existing communication channel, using minimal reference information. Do not request passport scans or payment details through the general enquiry endpoint.

For correction, update private working records and ensure future correspondence uses corrected details. Original email/provider logs may be immutable: link a restricted correction note and review whether an inaccurate original must be retained or can be deleted. Avoid recreating unnecessary copies.

For deletion, review promptly without waiting for the weekly cycle, check holds/booking/accounting obligations and apply the cross-system process to approved scope. Explain what was removed, what remains and why, and follow-up limitations through the verified channel. Do not promise a statutory deadline or unconditional deletion before applicable requirements are reviewed.

## Marketing and outstanding approvals

Enquiry acknowledgement is not promotional consent. Separate permission is required before promotional marketing; no marketing workflow is implemented.

Before activation: approve the final policy/notice, processing basis and provider terms/locations; verify actual account access, log/content retention and correction/deletion options; approve register/log location and periods, exception handling, incident escalation and separate booking/accounting schedules. The owner's planned post-launch verification uses the normal form and personal email only after separate release authorization. Treat that enquiry and provider records as personal information under this procedure; authorize cleanup separately. No settings, records or DNS are changed by this procedure.

Provider references: https://resend.com/security/gdpr and https://workspace.google.com/terms/dpa_terms.html . Review actual account settings and current terms; neither reference proves completion of deletion.
