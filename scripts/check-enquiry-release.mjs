import { pathToFileURL } from 'node:url'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'

export function checkEnquiryRelease(env, approved = PRIVACY_NOTICE.approved) {
  if (env.CONTEXT === 'production' && (!approved || env.VITE_ENQUIRY_INTAKE_ENABLED !== 'true')) {
    throw new Error('Phase 2A production release blocked: approve privacy information and explicitly enable enquiry intake before release.')
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) checkEnquiryRelease(process.env)
