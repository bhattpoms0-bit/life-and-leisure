import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createEnquiryDraft, getServiceFields, services, validateService } from '../../lib/serviceEnquiry'

export default function ServiceSelector() {
  const [active, setActive] = useState('flights')
  const [drafts, setDrafts] = useState({ flights: { tripType: 'Return', passengers: '2', cabin: 'Economy' }, hotels: { rooms: '1', guests: '2' }, trains: { passengers: '1', class: 'Please advise me' }, visa: { purpose: 'Tourism' }, holidays: { travellers: '2' } })
  const [error, setError] = useState('')
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
  const choose = (key) => { setActive(key); setError('') }
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
    const message = validateService(active, values, today)
    if (message) { setError(message); requestAnimationFrame(() => errorRef.current?.focus()); return }
    navigate('/contact', { state: { enquiryDraft: createEnquiryDraft(active, values) } })
  }
  return (
    <section id="service-selector" className="service-selector" aria-label="Plan your travel">
      <div className="selector-heading"><h2>Where shall we begin?</h2><p>Choose a service. We'll help with the details.</p></div>
      <div className="service-tabs" role="tablist" aria-label="Travel services">
        {services.map((item, index) => <button ref={element => { tabs.current[index] = element }} key={item.key} id={`tab-${item.key}`} role="tab" type="button" aria-selected={active === item.key} aria-controls={`panel-${item.key}`} tabIndex={active === item.key ? 0 : -1} onKeyDown={event => onTabKey(event, index)} onClick={() => choose(item.key)}><span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>{item.label}</button>)}
      </div>
      {services.map(item => <div key={item.key} id={`panel-${item.key}`} role="tabpanel" aria-labelledby={`tab-${item.key}`} hidden={active !== item.key}>
        {active === item.key && <form onSubmit={submit} className="service-form" aria-describedby="service-enquiry-note">
          <fieldset className="service-fieldset"><legend>{service.label} enquiry details</legend><div className="service-fields">{getServiceFields(active, values).map(field => <label className={`field field-${field.type}`} key={field.name} htmlFor={`${active}-${field.name}`}><span>{field.label}</span>
            {field.type === 'select' ? <select id={`${active}-${field.name}`} name={field.name} value={values[field.name] ?? ''} required onChange={event => { setDrafts(previous => ({ ...previous, [active]: { ...previous[active], [field.name]: event.target.value } })); setError('') }}>{field.options.map(option => <option key={option}>{option}</option>)}</select>
              : <input id={`${active}-${field.name}`} name={field.name} type={field.type} placeholder={field.placeholder} min={field.type === 'date' ? today : field.type === 'month' ? today.slice(0, 7) : field.min} max={field.max} maxLength={field.type === 'text' ? 160 : undefined} step={field.type === 'number' ? 1 : undefined} required value={values[field.name] ?? ''} onChange={event => { setDrafts(previous => ({ ...previous, [active]: { ...previous[active], [field.name]: event.target.value } })); setError('') }} />}
          </label>)}</div></fieldset>
          {active === 'flights' && values.tripType === 'Multi-city' && <p className="form-help">For more than two flights, add the remaining legs to your enquiry on the next page.</p>}
          {error && <p ref={errorRef} tabIndex={-1} className="form-error" role="alert">{error}</p>}
          <div className="service-form-bottom"><p id="service-enquiry-note">Continue to prepare a personal enquiry.<br /><span>No live availability or booking is confirmed here.</span></p><button className="button button-navy" type="submit">{service.action}<span aria-hidden="true">↗</span></button></div>
          {active === 'holidays' && <Link className="text-link" to="/packages">Or browse our existing holiday collection →</Link>}
        </form>}
      </div>)}
    </section>
  )
}
