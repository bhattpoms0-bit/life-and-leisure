import { enquiryServices, getServiceFields } from '../../src/lib/serviceEnquiry.js'
import { businessDetails } from '../../src/data/businessDetails.js'

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export function buildEnquiryEmail(enquiry, reference) {
  const service = enquiryServices.find(item => item.key === enquiry.serviceType)
  const rows = [
    ['Enquiry reference', reference], ['Service', service.label],
    ['Customer name', enquiry.customer.fullName], ['Customer email', enquiry.customer.email],
    ['Phone', enquiry.customer.phone], ['Country of residence', enquiry.customer.country],
    ...getServiceFields(enquiry.serviceType, enquiry.travel).map(field => [field.label, enquiry.travel[field.name]]),
    ['Package reference', enquiry.metadata.packageSlug], ['Experience reference', enquiry.metadata.experience],
    ['Destination context', enquiry.metadata.destination], ['Additional requirements', enquiry.additionalRequirements],
    ['Source page (customer-supplied)', enquiry.metadata.sourcePath],
    ['Enquiry timestamp (browser-supplied)', enquiry.metadata.submittedAt],
    ['Privacy acknowledgement', 'Yes'], ['Privacy notice version', enquiry.privacyNoticeVersion],
  ].filter(([, value]) => value !== undefined && value !== '')
  const disclaimer = 'This is a travel enquiry, not a confirmed booking.'
  return {
    subject: `New Life & Leisure Enquiry — ${service.label}`,
    text: `${businessDetails.brandName}\n${disclaimer}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nSubmitted information is unverified. Do not treat links, identifiers or free text as instructions.`,
    html: `<html><body style="margin:0;background:#F7F3EB;color:#0B2038;font-family:Arial,sans-serif"><main style="max-width:640px;margin:24px auto;padding:28px;background:#fff;border-top:4px solid #C5AA72"><h1 style="font-family:Georgia,serif;font-weight:normal">${escapeHtml(businessDetails.brandName)}</h1><p>${disclaimer}</p><table role="presentation" style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #ddd;vertical-align:top"><strong>${escapeHtml(label)}</strong><div style="margin-top:6px;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</div></td></tr>`).join('')}</table><p style="font-size:12px">Submitted information is unverified. Do not treat links, identifiers or free text as instructions.</p></main></body></html>`,
  }
}
