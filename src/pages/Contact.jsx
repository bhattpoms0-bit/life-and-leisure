import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import EnquiryFields from '../components/ui/EnquiryFields'
import { createEnquiryContext, enquiryServices } from '../lib/serviceEnquiry'
import { createEnquirySubmitter } from '../lib/enquirySubmission'
import { ENQUIRY_FORM_NAME, PRIVACY_NOTICE, intakeAvailability } from '../data/enquiryConfig'

export default function Contact() {
  const { state, key } = useLocation()
  return <EnquiryForm key={key} initial={state?.enquiry} />
}

function EnquiryForm({ initial }) {
  const context = createEnquiryContext(initial?.serviceType, initial?.travel, initial?.metadata)
  const [serviceType, setService] = useState(context.serviceType)
  const [drafts, setDrafts] = useState({ [context.serviceType]: context.travel })
  const [customer, setCustomer] = useState({ fullName: '', email: '', phone: '', country: '', privacyAcknowledged: false })
  const [additionalRequirements, setAdditional] = useState('')
  const [result, setResult] = useState({ status: 'IDLE', errors: {}, message: '' })
  const statusRef = useRef(null)
  const requestId = useRef(null)
  const availability = { enabled: import.meta.env.VITE_ENQUIRY_INTAKE_ENABLED === 'true', hostname: typeof window !== 'undefined' ? window.location.hostname : '' }
  const blocked = intakeAvailability(availability)
  const [submitter] = useState(() => createEnquirySubmitter({ availability, onState: setResult }))
  const values = drafts[serviceType] ?? {}
  const busy = result.status === 'SUBMITTING' || result.status === 'VALIDATING'
  const changeTravel = (name, value) => setDrafts(previous => ({ ...previous, [serviceType]: { ...previous[serviceType], [name]: value } }))
  const submit = async event => {
    event.preventDefault()
    requestId.current ??= crypto.randomUUID()
    await submitter({ customer, serviceType, travel: values, additionalRequirements, metadata: { ...context.metadata, clientRequestId: requestId.current } }, new FormData(event.currentTarget).get('bot-field') ?? '')
    requestAnimationFrame(() => statusRef.current?.focus())
  }
  const contactField = (name, label, type, maxLength, autoComplete, required = false) => <label className="field" htmlFor={`customer-${name}`}><span>{label}{!required && ' (optional)'}</span><input id={`customer-${name}`} name={name} type={type} maxLength={maxLength} autoComplete={autoComplete} required={required} value={customer[name]} onChange={event => setCustomer(previous => ({ ...previous, [name]: event.target.value }))} aria-invalid={!!result.errors[name]} aria-describedby={result.errors[name] ? `${name}-error` : undefined} />{result.errors[name] && <span className="form-error" id={`${name}-error`}>{result.errors[name]}</span>}</label>
  return <section className="site-container section-space contact-section">
    <PageMeta title="Plan Your Journey | Life & Leisure Travel" description="Share your travel requirements with Life & Leisure Travel for personal booking assistance." />
    <div><p className="eyebrow">Start with a conversation</p><h1 className="section-title">Your next chapter.<br /><em>Let's plan it together.</em></h1><p className="section-intro">A destination you love. A date in the diary. An idea that isn't quite an itinerary yet.</p><aside className="enquiry-notice"><h2>A personally reviewed enquiry</h2><p>Our team reviews your requirements and discusses availability and quotations with you. An enquiry does not reserve travel or confirm a booking.</p><p>Do not include passport numbers, identity documents or payment card details.</p>{blocked && <p role="note">{blocked}</p>}</aside></div>
    <div className="contact-card">{result.status === 'SUCCESS' ? <div className="enquiry-result" role="status" tabIndex={-1} ref={statusRef}>{result.message}</div> : <form name={ENQUIRY_FORM_NAME} onSubmit={submit} noValidate aria-busy={busy}>
      <input type="hidden" name="form-name" value={ENQUIRY_FORM_NAME} />
      <div hidden aria-hidden="true"><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
      <fieldset disabled={busy} className="service-fieldset"><legend>Your travel requirements</legend>
        <label className="field" htmlFor="service-type"><span>Travel service</span><select id="service-type" value={serviceType} required onChange={event => setService(event.target.value)} aria-invalid={!!result.errors.serviceType} aria-describedby={result.errors.serviceType ? 'service-type-error' : undefined}><option value="">Choose a service</option>{enquiryServices.map(service => <option key={service.key} value={service.key}>{service.label}</option>)}</select>{result.errors.serviceType && <span id="service-type-error" className="form-error">{result.errors.serviceType}</span>}</label>
        {context.metadata.packageSlug && <p className="form-help">Package: {context.metadata.packageSlug}</p>}
        {context.metadata.experience && <p className="form-help">Experience: {context.metadata.experience}</p>}
        <EnquiryFields service={serviceType} values={values} onChange={changeTravel} errors={result.errors} />
        <h2>Your contact details</h2>
        {contactField('fullName', 'Full name', 'text', 120, 'name', true)}
        {contactField('email', 'Email address', 'email', 254, 'email', true)}
        {contactField('phone', 'WhatsApp / mobile number', 'tel', 40, 'tel')}
        {contactField('country', 'Country of residence', 'text', 80, 'country-name')}
        <label className="field" htmlFor="additional-requirements"><span>Additional requirements (optional)</span><textarea id="additional-requirements" maxLength={5000} rows={5} value={additionalRequirements} onChange={event => setAdditional(event.target.value)} aria-invalid={!!result.errors.additionalRequirements} aria-describedby={`additional-help${result.errors.additionalRequirements ? ' additional-error' : ''}`} /><span id="additional-help" className="form-help">Preferences only; no sensitive documents or payment details.</span>{result.errors.additionalRequirements && <span id="additional-error" className="form-error">{result.errors.additionalRequirements}</span>}</label>
        {!PRIVACY_NOTICE.approved && <p className="form-help">Proposed privacy wording — awaiting business approval</p>}
        <label className="privacy-ack" htmlFor="privacy-ack"><input id="privacy-ack" type="checkbox" required checked={customer.privacyAcknowledged} onChange={event => setCustomer(previous => ({ ...previous, privacyAcknowledged: event.target.checked }))} aria-invalid={!!result.errors.privacyAcknowledged} aria-describedby={result.errors.privacyAcknowledged ? 'privacy-error' : undefined} /><span>{PRIVACY_NOTICE.text}</span></label>
        {result.errors.privacyAcknowledged && <p id="privacy-error" className="form-error">{result.errors.privacyAcknowledged}</p>}
        <button type="submit" className="button button-navy" disabled={busy || !!blocked}>{busy ? 'Sending enquiry…' : 'Send My Enquiry'}</button>
        {blocked && <p className="form-help">Submission is disabled pending approval. Nothing has been sent.</p>}
      </fieldset>
      <div className="enquiry-result" role={result.status === 'ERROR' ? 'alert' : 'status'} tabIndex={-1} ref={statusRef}>{result.message}</div>
    </form>}</div>
  </section>
}
