import { createHmac, timingSafeEqual } from 'node:crypto'
import { PRIVACY_NOTICE } from '../../src/data/enquiryConfig.js'
import { isRecord } from '../../src/lib/enquiryValidation.js'

// Public identities verified from PR #4's deployment metadata. No credentials.
export const PREVIEW_TEST_SITE_ID = 'bd40fa12-261f-4443-bb66-6d1862c38cf7'
export const PREVIEW_TEST_ORIGIN = 'https://deploy-preview-4--lifeandleisure.netlify.app'
export const PREVIEW_TEST_ENDPOINT = '/api/preview-enquiry-test'
export const PREVIEW_FIXTURE_ID = 'life-leisure-preview-v1'
export const MAX_PREVIEW_WINDOW_SECONDS = 900

export function previewTestSettings(env, context) {
  // Trusted platform context is mandatory; environment variables cannot authorize production.
  if (context.deploy?.context !== 'deploy-preview' || context.deploy?.published !== false) return null
  if (context.site?.id !== PREVIEW_TEST_SITE_ID || !/^[0-9a-f]{24}$/.test(context.deploy?.id ?? '')) return null
  if (env.PREVIEW_EMAIL_TEST_ENABLED !== 'true' || env.EMAIL_ENQUIRY_ENABLED !== 'false') return null
  if (env.PREVIEW_EMAIL_TEST_SITE_ID !== PREVIEW_TEST_SITE_ID || env.PREVIEW_EMAIL_TEST_ORIGIN !== PREVIEW_TEST_ORIGIN) return null
  if (!/^[0-9a-f]{64}$/.test(env.PREVIEW_EMAIL_TEST_AUTH_SECRET ?? '')) return null
  if (typeof env.PREVIEW_EMAIL_TEST_RESEND_API_KEY !== 'string' || !env.PREVIEW_EMAIL_TEST_RESEND_API_KEY || /\s/.test(env.PREVIEW_EMAIL_TEST_RESEND_API_KEY)) return null
  return { secret: env.PREVIEW_EMAIL_TEST_AUTH_SECRET, apiKey: env.PREVIEW_EMAIL_TEST_RESEND_API_KEY, deployId: context.deploy.id }
}

// A signed permit pins a deploy after it exists, avoiding a redeploy/pinned-ID cycle.
// It is not a JWT: there are no caller-selected algorithms, keys or headers.
export function authorizePreviewPermit(authorization, settings, now) {
  if (typeof authorization !== 'string' || authorization.length > 2048 || !authorization.startsWith('Bearer ')) return null
  const parts = authorization.slice(7).split('.')
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]{1,1536}$/.test(parts[0]) || !/^[0-9a-f]{64}$/.test(parts[1])) return null
  const expected = createHmac('sha256', Buffer.from(settings.secret, 'hex')).update(parts[0]).digest()
  if (!timingSafeEqual(expected, Buffer.from(parts[1], 'hex'))) return null
  try {
    const bytes = Buffer.from(parts[0], 'base64url')
    if (bytes.toString('base64url') !== parts[0]) return null
    const claims = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    const keys = ['version', 'siteId', 'deployId', 'origin', 'issuedAt', 'expiresAt', 'fixtureId', 'noticeVersion']
    if (!isRecord(claims) || Object.keys(claims).length !== keys.length || !Object.keys(claims).every(key => keys.includes(key))) return null
    if (claims.version !== 1 || claims.siteId !== PREVIEW_TEST_SITE_ID || claims.deployId !== settings.deployId || claims.origin !== PREVIEW_TEST_ORIGIN || claims.fixtureId !== PREVIEW_FIXTURE_ID || claims.noticeVersion !== PRIVACY_NOTICE.version) return null
    if (!Number.isSafeInteger(claims.issuedAt) || !Number.isSafeInteger(claims.expiresAt)) return null
    const duration = claims.expiresAt - claims.issuedAt
    const current = Math.floor(now.getTime() / 1000)
    if (!Number.isFinite(current) || duration <= 0 || duration > MAX_PREVIEW_WINDOW_SECONDS || current < claims.issuedAt || current >= claims.expiresAt) return null
    return claims
  } catch { return null }
}
