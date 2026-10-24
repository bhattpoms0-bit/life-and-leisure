// Populate only with owner-approved, verified business information.
// Empty fields are omitted from the footer, including their headings.
export const businessDetails = {
  email: null,
  phone: null,
  address: null,
  supportHours: null,
  policies: [], // { label, to } for existing, approved policy routes
  trustInformation: [], // Approved factual statements; no invented credentials
}
