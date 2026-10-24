import { getServiceFields, todayLocal } from '../../lib/serviceEnquiry'

export default function EnquiryFields({ service, values, onChange, errors = {}, prefix = 'travel' }) {
  const today = todayLocal()
  return <>
    <div className="service-fields">{getServiceFields(service, values).map(field => {
      const id = `${prefix}-${field.name}`
      const props = { id, name: field.name, value: values[field.name] ?? '', required: field.required, onChange: event => onChange(field.name, event.target.value), 'aria-invalid': !!errors[field.name], 'aria-describedby': errors[field.name] ? `${id}-error` : undefined }
      return <label className={`field field-${field.type}`} key={field.name} htmlFor={id}><span>{field.label}{!field.required && ' (optional)'}</span>
        {field.type === 'select' ? <select {...props}><option value="">Please select</option>{field.options.map(option => <option key={option}>{option}</option>)}</select> : <input {...props} type={field.type} placeholder={field.placeholder} maxLength={field.maxLength} min={field.type === 'date' ? today : field.type === 'month' ? today.slice(0, 7) : field.min} max={field.max} step={field.type === 'number' ? 1 : undefined} />}
        {errors[field.name] && <span className="form-error" id={`${id}-error`}>{errors[field.name]}</span>}
      </label>
    })}</div>
    {service === 'flights' && values.tripType === 'Multi-city' && <div className="button-row"><button className="button button-outline" type="button" disabled={(values.extraFlights ?? 0) >= 3} onClick={() => onChange('extraFlights', (values.extraFlights ?? 0) + 1)}>Add another flight</button>{values.extraFlights > 0 && <button className="button button-outline" type="button" onClick={() => onChange('extraFlights', values.extraFlights - 1)}>Remove last flight</button>}</div>}
  </>
}
