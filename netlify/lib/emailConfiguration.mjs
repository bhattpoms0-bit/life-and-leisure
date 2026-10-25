import { PRIVACY_NOTICE } from '../../src/data/enquiryConfig.js'
import { businessDetails } from '../../src/data/businessDetails.js'
import { isEmail } from '../../src/lib/enquiryValidation.js'

// No environment defaults authorize sending. Never import this module in React.
export function getEmailConfiguration(env, privacyApproved = PRIVACY_NOTICE.approved) {
  if (!privacyApproved || env.EMAIL_ENQUIRY_ENABLED !== 'true') return null
  if (!['production', 'deploy-preview'].includes(env.EMAIL_ENQUIRY_CONTEXT)) return null
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(env.EMAIL_ENQUIRY_SITE_ID ?? '')) return null
  if (!isEmail(env.RESEND_FROM_EMAIL) || env.EMAIL_ENQUIRY_TO !== businessDetails.email) return null
  if (typeof env.RESEND_API_KEY !== 'string' || !env.RESEND_API_KEY || /\s/.test(env.RESEND_API_KEY)) return null
  try {
    const origin = new URL(env.EMAIL_ENQUIRY_ORIGIN)
    if (origin.protocol !== 'https:' || origin.origin !== env.EMAIL_ENQUIRY_ORIGIN) return null
    const production = ['lifeandleisure.travel', 'www.lifeandleisure.travel'].includes(origin.hostname)
    const preview = /^deploy-preview-[1-9][0-9]*--[a-z0-9]+(?:-[a-z0-9]+)*\.netlify\.app$/.test(origin.hostname)
    if (env.EMAIL_ENQUIRY_CONTEXT === 'production' ? !production : !preview) return null
    return { origin: origin.origin, siteId: env.EMAIL_ENQUIRY_SITE_ID, context: env.EMAIL_ENQUIRY_CONTEXT, apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM_EMAIL, to: businessDetails.email }
  } catch { return null }
}
