import { pathToFileURL } from 'node:url'
import { PRIVACY_NOTICE } from '../src/data/enquiryConfig.js'
import { getEmailConfiguration } from '../netlify/lib/emailConfiguration.mjs'

export function checkEnquiryRelease(env, notice = PRIVACY_NOTICE, now = new Date()) {
  if (env.CONTEXT === 'production') {
    const settings = getEmailConfiguration(env, notice, now)
    if (!settings || settings.context !== 'production' || settings.siteId !== env.SITE_ID || env.VITE_ENQUIRY_INTAKE_ENABLED !== 'true') {
      throw new Error('Email-first production release blocked: adopted privacy version/effective date, server activation, approved sender/provider configuration and authorized site/context are required.')
    }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) checkEnquiryRelease(process.env)
