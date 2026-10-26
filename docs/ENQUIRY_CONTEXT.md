# Enquiry context and review

The existing schemaVersion 1 payload now permits two optional metadata strings:

- `groupPreference`: only `Group (4+)`, only for a holidays enquiry with a package reference. This records the original package selector preference, never an exact traveller count. The customer must enter an accurate count in the required Travellers field. The server validates both independently.
- `sourceCta`: an identifier from `ENQUIRY_CTAS` in `src/lib/serviceEnquiry.js`. Generic header, mobile, footer, hero and consultation links send this identifier and the originating pathname/hash. They do not select a travel service. Query strings are excluded to avoid copying incidental personal information. The server rejects non-local paths, query strings, backslashes, control characters and unknown CTA identifiers.

All metadata remains customer-supplied and untrusted, not verified analytics or booking authority. Server validation constrains its schema, types, lengths and enumerations. It does not prove the visitor followed a particular CTA or package link.

Package `metadata.destination` remains the original package destination snapshot while `travel.destination` is the editable current request. Editing travel details never overwrites that snapshot. Contact displays a friendly package name from the local catalogue and separate original/current destination labels. Emails distinguish those destinations and explicitly mark original context as customer-supplied. Unknown package references are not treated as verified catalogue records.

Contact shows the selected service, available package/original destination, current destination, group preference, experience/tier and human-readable CTA context. Customer contact details, additional requirements and all travel fields remain editable in the form; no technical request IDs or package slugs are added to its summary.

Switching service retains contact details, source page and CTA attribution. It clears package, original destination, experience and group metadata. Compatible fields transfer and saved per-service travel/additional-requirement drafts can return; cleared package/group metadata does not return with those drafts. Drafts are local to the mounted form, not persistent storage.

No activation controls change: privacy remains unapproved, the normal email endpoint remains disabled by default and the production release guard remains active. The intended release no longer includes temporary preview-only email functionality. Tests inject offline provider responses and mock configuration; they do not activate a deployed endpoint or send emails.
