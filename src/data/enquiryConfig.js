import { isPrivacyAdopted } from '../lib/privacyAdoption.js'

export const ENQUIRY_FORM_NAME = 'life-leisure-enquiry'
export const ENQUIRY_ENDPOINT = '/api/enquiries'
const acknowledgementBeforeLink = 'I have read the '
const acknowledgementAfterLink = ' and agree to Life & Leisure Travel using the information I provide to review and respond to my travel enquiry.\n\nI understand that submitting an enquiry does not confirm a booking.'
export const PRIVACY_NOTICE = {
  approved: true,
  version: 'email-first-v1',
  effectiveDate: '2026-10-26', // Owner-approved date, interpreted in Asia/Kolkata.
  beforeLink: acknowledgementBeforeLink,
  afterLink: acknowledgementAfterLink,
  text: `${acknowledgementBeforeLink}Privacy Policy${acknowledgementAfterLink}`,
}

// Public UI hint only. The function independently enforces activation and privacy.
export function intakeAvailability({ enabled, hostname, previewSiteName = '', privacyApproved = isPrivacyAdopted(PRIVACY_NOTICE) }) {
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
