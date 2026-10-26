# Phase 2A: email-first enquiries - production preparation

Branch `feature/email-first-enquiries` contains the normal email-first implementation and enquiry-context corrections. Draft PR #4 has a disabled visual preview; these local production-preparation changes are not committed, pushed, deployed or activated. The original Phase 2A branch, older Draft PR #3, production and the abandoned independent testing project are not modified by this preparation.

The eight services, five homepage forms, twelve package routes, group preference, source attribution, original/requested destinations, Contact review summary and validation remain. Contact sends JSON to `/api/enquiries`; the function validates before calling Resend. Netlify Forms registration/storage is not used. Legacy hosted records, if any, are not deleted by source changes.

Privacy remains `approved: false`, `email-first-draft-1`, `effectiveDate: null`. Shared adoption checks now require explicit approval, a valid final version and a valid non-future effective date, plus provider/site/context/activation configuration. The approved sender is pinned to `notifications@mail.lifeandleisure.travel`; recipient is fixed to `enquiries@lifeandleisure.travel`. Owner-reported domain verification does not prove deployed credential configuration or successful delivery.

Only the normal enquiry endpoint belongs in this release. Temporary preview-only delivery functionality is retired locally. Existing validation and context regression coverage is retained; release tests assert the intended function inventory. No customer database, queue, payment collection, upload facility or automatic reply is introduced.

Provider acceptance is not inbox delivery or booking confirmation. The owner's planned immediate post-launch verification will use the normal form and a personal email, only after separate release authorization. Current intake remains disabled and no email is sent by local tests.

See [EMAIL_FIRST_ENQUIRIES.md](EMAIL_FIRST_ENQUIRIES.md) for guarded configuration, approval sequence, Free-plan isolation, monitoring and rollback; [ENQUIRY_CONTEXT.md](ENQUIRY_CONTEXT.md) for context handling; and [ENQUIRY_RETENTION_PROCEDURE.md](ENQUIRY_RETENTION_PROCEDURE.md) for weekly manual retention. None authorizes activation, privacy approval or deletion.
