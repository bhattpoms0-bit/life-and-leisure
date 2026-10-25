import { createPreviewEnquiryTestHandler } from '../lib/previewEnquiryTest.mjs'

export default createPreviewEnquiryTestHandler()
export const config = {
  path: '/api/preview-enquiry-test',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}
