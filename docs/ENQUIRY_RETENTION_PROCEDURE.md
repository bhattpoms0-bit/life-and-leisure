# Draft manual enquiry retention procedure

Status: OWNER REVIEW ONLY. Not approved, not activated. No customer records have been accessed or deleted as part of this implementation. No scheduled job or automatic deletion is implemented.

Scope: enquiries that do not result in confirmed bookings. The proposed general retention period is up to 90 calendar days after the last relevant customer communication. Confirmed bookings, invoices, payments and transaction records need a separately approved retention schedule. An ongoing matter, legal obligation or dispute can justify a documented exception; age alone is not authority to delete those records.

## Ownership and access

The owner must name one authorized staff member to manage Netlify Forms, the Google Workspace enquiry mailbox and any exports. Give that operator only the access needed for the role, use individual accounts, avoid shared passwords, and keep enquiry records out of public/shared folders. Owner or administrator access and emergency cover must be reviewed explicitly; this document does not change any account permissions. Review access before activation and when the staff role changes. Do not introduce a CRM or another paid tool for this procedure.

## Record last relevant communication

Maintain a minimal private enquiry register in an owner-approved restricted location, never in this repository. For each enquiry record the Netlify submission identifier/client request ID, received date, last relevant customer communication date, related email-thread reference, status, any booking reference, review-due date, known copies and any retention hold. Use the received date if there has been no later relevant customer communication. Record dates consistently in Asia/Kolkata and calculate the review-due date as last communication plus 90 calendar days.

A customer reply or substantive exchange about their travel requirements can update the date. Automated acknowledgements, internal notes, opening an email, spam or a marketing message do not restart the clock. Record the reason for any date correction; do not retain a full second copy of the enquiry in the register. Use only the identifiers needed to reconcile copies.

## Weekly review

1. The authorized operator reviews the register and both verified and spam submissions once each week. Include enquiries reaching 90 days before the next review, and prioritize anything already over 90 days. A weekly review is a manual schedule, not a guarantee of erasure at an exact hour on day 90.
2. Reconcile the latest customer communication against Gmail before using the received-at date as a retention cutoff. Check for duplicate submissions, related threads and downloaded copies.
3. Check whether the enquiry became a confirmed booking, remains an active quotation or other ongoing matter, or is subject to a complaint, dispute, preservation instruction or legal obligation. Do not delete a booking record simply because its original enquiry is old.
4. For an exception, record the reason, owner decision, relevant record scope and next review date. Ask the owner to resolve unclear obligations rather than inventing statutory periods. A hold must be reviewed; it is not an indefinite default for every enquiry.
5. For an expired enquiry without an exception, verify its identifier and scope before deletion. Do not create a fresh CSV export as a routine backup before deleting it.

## Delete expired copies after authorization

1. In the correct Netlify project's Forms area, locate the exact submission(s), check the identifier against the private register and delete the expired submission records using the available provider controls. Do not delete the entire form or change form detection. Review spam records as well. Confirm the selected records are no longer listed. Provider-side processing or backups may have separate retention; do not certify erasure beyond what was actually checked.
2. Review the corresponding Google Workspace Gmail messages, including received notification emails, staff replies, quoted enquiry content, attachments, forwarded copies and duplicate threads. Remove expired material within the authorized scope. If a thread also contains booking or held information, separate the decision and escalate uncertain cases rather than deleting the whole thread. Moving mail to Trash is not the same as permanent erasure. Review Trash and any account retention/hold settings with the owner or administrator under the approved process; do not bypass a hold or promise immediate provider-wide deletion.
3. Review downloaded CSV exports and other known copies in Downloads, working folders, approved cloud folders and any staff-held working documents. Remove expired rows or files without disturbing records still required. Check recycle/trash locations and synced copies as applicable. Do not send a copy to another mailbox or device to preserve it. If a copy cannot be located or removed, log the unresolved item and escalate it.
4. Record each action in the restricted deletion log: minimal enquiry identifier, last communication date, review/due date, systems checked, action date, operator, result, exceptions/remaining copies and next follow-up. Keep full customer messages out of the log. The owner must approve a retention period for this minimal log and the private register; neither should become permanent replacement storage.
5. Distinguish completed deletion in business-controlled locations from pending provider retention, mail trash, backups or legal holds. Close the review only when known actions are accounted for, with any remaining limitation recorded honestly.

## Correction and deletion requests

Use the official email in `src/data/businessDetails.js` as the request channel. Locate the relevant enquiry using a minimal reference and verify the requester proportionately, preferably using the existing email channel. Do not request passport scans or payment details through the general form.

For a correction, confirm the intended change, update the private working record where supported, and ensure staff use the corrected information. Netlify submissions are original received records: do not assume the dashboard can edit them. If an original cannot be corrected in place, use a restricted correction note linked by identifier and review with the owner whether the inaccurate original should be deleted or retained for a documented reason. Avoid unnecessary duplicate copies and preserve an honest record of what changed.

For deletion, review the request promptly without waiting for the weekly 90-day cycle. Check ongoing matters, booking records, applicable obligations and disputes, then apply the same cross-system checks above to the approved scope. Escalate uncertain identity, disputed records or retention requirements to the owner. Respond through the verified channel with what was done, anything still retained and why, and any follow-up needed. Do not promise a statutory deadline or unconditional deletion without an approved legal basis for that statement.

## Owner decisions required before operation

- Approve the policy and acknowledgement version, applicable privacy obligations and basis for processing.
- Confirm the single operator, access permissions and owner/admin oversight.
- Approve the register/log location, minimum fields and their own retention periods.
- Confirm provider terms, processing locations, Gmail/Netlify retention limitations, any backups or holds and all existing exports.
- Approve exception criteria, escalation, correction/deletion request handling and separate booking/transaction retention periods.
- Review automatic preview builds and site-wide form detection before any push or deployment. A disabled UI is not an endpoint privacy gate.

## Provider references for owner review

- [Netlify submission management](https://docs.netlify.com/manage/forms/submissions/)
- [Netlify privacy information](https://www.netlify.com/privacy/)
- [Google Workspace processing terms](https://workspace.google.com/terms/dpa_terms.html)

These references do not establish the account's actual settings or guarantee immediate deletion. No provider configuration has been changed.
