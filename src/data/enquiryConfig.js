export const ENQUIRY_FORM_NAME = 'life-leisure-enquiry'
const acknowledgementBeforeLink = 'I have read the '
const acknowledgementAfterLink = ' and agree to Life & Leisure Travel using the information I provide to review and respond to my travel enquiry.\n\nI understand that submitting an enquiry does not confirm a booking.'
export const PRIVACY_NOTICE = {
  approved: false,
  version: 'phase2a-draft-2',
  beforeLink: acknowledgementBeforeLink,
  afterLink: acknowledgementAfterLink,
  text: `${acknowledgementBeforeLink}Privacy Policy${acknowledgementAfterLink}`,
}

// UI checks only: neither hostname matching nor public flags authenticate callers
// or prevent direct POSTs to a form already registered with Netlify.
export function intakeAvailability({ enabled, hostname, previewSiteName = '', privacyApproved = PRIVACY_NOTICE.approved }) {
  if (!privacyApproved) return 'Privacy information is awaiting business approval. Online submission is not enabled.'
  if (!enabled) return 'Online enquiry submission has not been enabled yet.'
  const host = (hostname ?? '').toLowerCase()
  const productionHost = host === 'lifeandleisure.travel' || host === 'www.lifeandleisure.travel'
  const preview = /^deploy-preview-[1-9][0-9]*--([a-z0-9]+(?:-[a-z0-9]+)*)\.netlify\.app$/.exec(host)
  const approvedPreview = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(previewSiteName) && preview?.[1] === previewSiteName
  if (!productionHost && !approvedPreview) {
    return 'Online submission requires the company website or an explicitly configured Life & Leisure Deploy Preview.'
  }
  return ''
}

export const NETLIFY_FIELDS = [
  'form-name', 'bot-field', 'schema_version', 'service_type', 'customer_name',
  'email', 'phone', 'country', 'privacy_acknowledged', 'privacy_notice_version',
  'travel_details', 'travel_summary', 'additional_requirements', 'client_request_id',
  'source_path', 'package_slug', 'destination_context', 'experience_context',
]
