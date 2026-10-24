import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'

export default function Contact() {
  const { state, key } = useLocation()
  return <ContactDraft key={key} initialMessage={typeof state?.enquiryDraft === 'string' ? state.enquiryDraft : ''} />
}

function ContactDraft({ initialMessage }) {
  const [form, setForm] = useState({ name: '', email: '', message: initialMessage })
  const [draft, setDraft] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }))
  const prepare = event => {
    event.preventDefault()
    setDraft(`Travel enquiry\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`)
    setCopyStatus('')
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(draft); setCopyStatus('Draft copied. Nothing has been sent.') }
    catch { setCopyStatus('Please select and copy the draft below. Nothing has been sent.') }
  }
  return <section className="site-container section-space contact-section">
    <PageMeta title="Plan Your Journey | Life & Leisure Travel" description="Prepare a personalised travel enquiry for holidays, flights, hotels, trains or visa assistance with Life & Leisure Travel." />
    <div><p className="eyebrow">Start with a conversation</p><h1 className="section-title">Your next chapter.<br /><em>Let's plan it together.</em></h1><p className="section-intro">A destination you love. A date in the diary. An idea that isn't quite an itinerary yet.</p><aside className="enquiry-notice"><h2>Prepare your enquiry</h2><p>Online enquiry delivery is not connected yet. This form prepares a draft you can copy and share through your existing Life & Leisure contact. Nothing is sent or booked here.</p></aside></div>
    <div className="contact-card">{draft ? <div className="draft-review"><h2>Your enquiry draft</h2><p>Review and copy your details. This is not a submission confirmation.</p><label className="field" htmlFor="enquiry-draft"><span>Draft to copy</span><textarea id="enquiry-draft" rows={13} value={draft} readOnly /></label><div className="button-row"><button type="button" className="button button-navy" onClick={copy}>Copy enquiry</button><button type="button" className="button button-outline" onClick={() => setDraft('')}>Edit details</button></div><p role="status">{copyStatus}</p></div> : <form onSubmit={prepare}><label className="field" htmlFor="contact-name"><span>Your name</span><input id="contact-name" autoComplete="name" name="name" required maxLength={120} value={form.name} onChange={change} pattern=".*\S.*" /></label><label className="field" htmlFor="contact-email"><span>Email address</span><input id="contact-email" type="email" autoComplete="email" name="email" required maxLength={254} value={form.email} onChange={change} /></label><label className="field" htmlFor="contact-message"><span>Your travel plans</span><textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={9} value={form.message} onChange={change} placeholder="Where would you like to go, and what matters most to you?" /></label><button type="submit" className="button button-navy">Review My Enquiry <span aria-hidden="true">↗</span></button><p className="form-help">Draft preparation only. No data is transmitted by this form.</p></form>}</div>
  </section>
}
