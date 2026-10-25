import { createEmailEnquiryHandler } from '../lib/enquiryHandler.mjs'

export default createEmailEnquiryHandler()

// Netlify's edge-enforced per-domain/IP rule; activation still fails closed.
// Inspect deploy logs before relying on platform enforcement.
export const config = {
  path: '/api/enquiries',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}
