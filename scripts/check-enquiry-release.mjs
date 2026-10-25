import { pathToFileURL } from 'node:url'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'
import { getEmailConfiguration } from '../netlify/lib/emailConfiguration.mjs'

export function checkEnquiryRelease(env, approved = PRIVACY_NOTICE.approved) {
  if (env.CONTEXT === 'production') {
    const settings = getEmailConfiguration(env, approved)
    if (!settings || settings.context !== 'production' || settings.siteId !== env.SITE_ID || env.VITE_ENQUIRY_INTAKE_ENABLED !== 'true') {
      throw new Error('Email-first production release blocked: privacy approval, server activation, provider configuration and authorized site/context are required.')
    }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) checkEnquiryRelease(process.env)
