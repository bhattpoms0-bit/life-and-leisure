export const ENQUIRY_FORM_NAME = 'life-leisure-enquiry'
export const PRIVACY_NOTICE = {
  approved: false,
  version: 'phase2a-draft-1',
  text: 'I acknowledge that Life & Leisure will use the contact details and travel requirements I provide to respond to this enquiry. My enquiry will be processed using Netlify Forms. This does not subscribe me to marketing messages. I will not include passport numbers, identity documents or payment card details.',
}

// Public feature switch, never a secret. Approval is also required in source.
export function intakeAvailability({ enabled, hostname, privacyApproved = PRIVACY_NOTICE.approved }) {
  if (!privacyApproved) return 'Privacy information is awaiting business approval. Online submission is not enabled.'
  if (!enabled) return 'Online enquiry submission has not been enabled yet.'
  if (!/^(?:lifeandleisure\.travel|www\.lifeandleisure\.travel|[a-z0-9-]+\.netlify\.app)$/i.test(hostname ?? '')) {
    return 'Local development cannot receive Netlify Forms submissions. An approved Netlify preview is required.'
  }
  return ''
}

export const NETLIFY_FIELDS = [
  'form-name', 'bot-field', 'schema_version', 'service_type', 'customer_name',
  'email', 'phone', 'country', 'privacy_acknowledged', 'privacy_notice_version',
  'travel_details', 'travel_summary', 'additional_requirements', 'client_request_id',
  'source_path', 'package_slug', 'destination_context', 'experience_context',
]
