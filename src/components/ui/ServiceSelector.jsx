import EnquiryFields from './EnquiryFields'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createEnquiryContext, services, validateTravel } from '../../lib/serviceEnquiry'

export default function ServiceSelector() {
  const [active, setActive] = useState('flights')
  const [drafts, setDrafts] = useState({ flights: { tripType: 'Return', passengers: '2', cabin: 'Economy' }, hotels: { rooms: '1', guests: '2' }, trains: { passengers: '1', class: 'Please advise me' }, visa: { purpose: 'Tourism' }, holidays: { travellers: '2' } })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const tabs = useRef([])
  const errorRef = useRef(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedService = searchParams.get('service')
  useEffect(() => {
    if (services.some(item => item.key === requestedService)) { setActive(requestedService); setError('') }
  }, [requestedService])
  const service = services.find(item => item.key === active)
  const values = drafts[active]
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const choose = (key) => { setActive(key); setError(''); setFieldErrors({}) }
  const onTabKey = (event, index) => {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % services.length
    if (event.key === 'ArrowLeft') next = (index - 1 + services.length) % services.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = services.length - 1
    if (next === undefined) return
    event.preventDefault(); choose(services[next].key); tabs.current[next].focus()
  }
  const submit = event => {
    event.preventDefault()
    const errors = validateTravel(active, values, today)
    setFieldErrors(errors)
    const message = Object.values(errors)[0]
    if (message) { setError(message); requestAnimationFrame(() => errorRef.current?.focus()); return }
    navigate('/contact', { state: { enquiry: createEnquiryContext(active, values, { sourcePath: '/' }) } })
  }
  return (
    <section id="service-selector" className="service-selector" aria-label="Plan your travel">
      <div className="selector-heading"><h2>Where shall we begin?</h2><p>Choose a service. We'll help with the details.</p></div>
      <div className="service-tabs" role="tablist" aria-label="Travel services">
        {services.map((item, index) => <button ref={element => { tabs.current[index] = element }} key={item.key} id={`tab-${item.key}`} role="tab" type="button" aria-selected={active === item.key} aria-controls={`panel-${item.key}`} tabIndex={active === item.key ? 0 : -1} onKeyDown={event => onTabKey(event, index)} onClick={() => choose(item.key)}><span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>{item.label}</button>)}
      </div>
      {services.map(item => <div key={item.key} id={`panel-${item.key}`} role="tabpanel" aria-labelledby={`tab-${item.key}`} hidden={active !== item.key}>
        {active === item.key && <form noValidate onSubmit={submit} className="service-form" aria-describedby="service-enquiry-note">
          <fieldset className="service-fieldset"><legend>{service.label} enquiry details</legend><EnquiryFields prefix={active} service={active} values={values} errors={fieldErrors} onChange={(name, value) => { setDrafts(previous => ({ ...previous, [active]: { ...previous[active], [name]: value } })); setError(''); setFieldErrors({}) }} /></fieldset>
          {error && <p ref={errorRef} tabIndex={-1} className="form-error" role="alert">{error}</p>}
          <div className="service-form-bottom"><p id="service-enquiry-note">Continue to prepare a personal enquiry.<br /><span>No live availability or booking is confirmed here.</span></p><button className="button button-navy" type="submit">{service.action}<span aria-hidden="true">↗</span></button></div>
          {active === 'holidays' && <Link className="text-link" to="/packages">Or browse our existing holiday collection →</Link>}
        </form>}
      </div>)}
    </section>
  )
}
