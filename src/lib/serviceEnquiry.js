export const enquiryServices = [
  { key: 'flights', label: 'Flights', icon: 'flight', action: 'Request Flight Quote' },
  { key: 'hotels', label: 'Hotels', icon: 'hotel', action: 'Request Hotel Quote' },
  { key: 'trains', label: 'Trains', icon: 'train', action: 'Request Train Assistance' },
  { key: 'visa', label: 'Visa', icon: 'travel_explore', action: 'Check Visa Assistance' },
  { key: 'holidays', label: 'Holidays', icon: 'beach_access', action: 'Explore Holidays' },
  { key: 'tailor_made', label: 'Tailor-made travel' },
  { key: 'inbound_india', label: 'Inbound India tours' },
]
export const services = enquiryServices.slice(0, 5)
export const isServiceType = value => enquiryServices.some(service => service.key === value)
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD', 'JPY', 'CHF']
const text = (name, label, placeholder, required = true) => ({ name, label, placeholder, type: 'text', maxLength: 160, required })
const date = (name, label) => ({ name, label, type: 'date', required: true })
const number = (name, label, max = 20) => ({ name, label, type: 'number', min: 1, max, required: true })
const select = (name, label, options) => ({ name, label, type: 'select', options, required: true })
const currency = () => select('currency', 'Budget currency', CURRENCIES)
const month = (name, label) => ({ name, label, type: 'month', required: true })

export function todayLocal(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function getServiceFields(service, values = {}) {
  values = values && typeof values === 'object' ? values : {}
  switch (service) {
    case 'flights': {
      const extraCount = Number.isInteger(values.extraFlights) ? Math.min(3, Math.max(0, values.extraFlights)) : 0
      return [text('from', 'From', 'City or airport'), text('to', 'To', 'City or airport'),
        select('tripType', 'Trip type', ['Return', 'One-way', 'Multi-city']), date('departure', 'Departure date'),
        ...(values.tripType === 'Return' ? [date('return', 'Return date')] : []),
        ...(values.tripType === 'Multi-city' ? [text('nextFrom', 'Next flight from', 'City or airport'), text('nextTo', 'Next flight to', 'City or airport'), date('nextDeparture', 'Next departure'),
          ...Array.from({ length: extraCount }, (_, index) => [text(`leg${index + 3}From`, `Flight ${index + 3} from`, 'City or airport'), text(`leg${index + 3}To`, `Flight ${index + 3} to`, 'City or airport'), date(`leg${index + 3}Date`, `Flight ${index + 3} departure`)]).flat()] : []),
        number('passengers', 'Passengers'), select('cabin', 'Cabin class', ['Economy', 'Premium Economy', 'Business', 'First'])]
    }
    case 'hotels': return [text('destination', 'Destination', 'City or region'), date('checkIn', 'Check-in'), date('checkOut', 'Check-out'), number('rooms', 'Rooms', 10), number('guests', 'Guests')]
    case 'trains': return [text('from', 'Departure station', 'Station or city'), text('to', 'Arrival station', 'Station or city'), date('departure', 'Travel date'), select('class', 'Travel class', ['Please advise me', 'Sleeper', 'AC 3 Tier', 'AC 2 Tier', 'AC First Class', 'AC Chair Car', 'Executive Chair Car']), number('passengers', 'Passengers')]
    case 'visa': return [text('destination', 'Destination country', 'Where are you travelling?'), text('nationality', 'Passport nationality', 'Nationality only; no passport number'), select('purpose', 'Purpose of travel', ['Tourism', 'Business', 'Family visit', 'Other — please advise']), text('period', 'Approximate travel period', 'e.g. June 2027, dates flexible', false)]
    case 'holidays': return [text('destination', 'Destination', 'A country, region or idea'), month('month', 'Preferred travel month'), number('travellers', 'Travellers'), text('budget', 'Approximate budget', 'Amount or “please advise”'), currency(), text('preferences', 'Travel preferences', 'Interests, pace or preferred stays', false)]
    case 'tailor_made': return [text('destination', 'Preferred destination', 'A country or region'), text('period', 'Travel period', 'Your approximate dates or month'), number('travellers', 'Travellers'), text('interests', 'Interests', 'What would make this trip special?', false), text('budget', 'Approximate budget', 'Optional', false), ...((typeof values.budget === 'string' && values.budget.trim()) ? [currency()] : [])]
    case 'inbound_india': return [text('destination', 'Destinations of interest in India', 'Places or regions'), date('arrival', 'Preferred arrival date'), date('departure', 'Preferred departure date'), number('travellers', 'Travellers'), text('experiences', 'Experience preferences', 'Culture, wildlife, mountains or leisure', false), text('budget', 'Approximate budget', 'Optional', false), ...((typeof values.budget === 'string' && values.budget.trim()) ? [currency()] : [])]
    default: return []
  }
}

export function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function validateTravel(service, values = {}, today = todayLocal()) {
  if (!isServiceType(service)) return { serviceType: 'Please choose a valid travel service.' }
  values = values && typeof values === 'object' ? Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])) : {}
  const errors = {}
  for (const field of getServiceFields(service, values)) {
    const raw = values[field.name]
    const value = typeof raw === 'string' || typeof raw === 'number' ? String(raw).trim() : ''
    if (!value) { if (field.required) errors[field.name] = `Please enter ${field.label.toLowerCase()}.`; continue }
    if (typeof raw !== 'string' && !(field.type === 'number' && typeof raw === 'number')) errors[field.name] = `Enter a valid ${field.label.toLowerCase()}.`
    else if (value.length > (field.maxLength ?? 160) || /[\r\n]/.test(value) || value.includes('\u0000')) errors[field.name] = `${field.label} must be a single line of at most ${field.maxLength ?? 160} characters.`
    else if (field.type === 'number' && (!Number.isInteger(Number(value)) || Number(value) < field.min || Number(value) > field.max)) errors[field.name] = `${field.label} must be between ${field.min} and ${field.max}.`
    else if (field.type === 'select' && !field.options.includes(value)) errors[field.name] = `Please choose a valid ${field.label.toLowerCase()}.`
    else if (field.type === 'date' && (!isCalendarDate(value) || value < today)) errors[field.name] = 'Choose a valid calendar date today or later.'
    else if (field.type === 'month' && (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value) || value < today.slice(0, 7))) errors[field.name] = 'Choose this month or a later valid month.'
  }
  const compareLeg = (from, to, dateKey, previousDate) => {
    if (typeof values[from] === 'string' && typeof values[to] === 'string' && values[from].trim().toLowerCase() === values[to].trim().toLowerCase() && values[from].trim()) errors[to] = 'Departure and arrival must be different.'
    if (previousDate && !errors[dateKey] && isCalendarDate(values[dateKey]) && values[dateKey] < previousDate) errors[dateKey] = 'The next flight must depart on or after the previous flight.'
  }
  if (service === 'flights' || service === 'trains') compareLeg('from', 'to', 'departure')
  if (service === 'flights' && values.tripType === 'Return' && isCalendarDate(values.return) && isCalendarDate(values.departure) && values.return <= values.departure) errors.return = 'Return date must be after departure.'
  if (service === 'flights' && values.tripType === 'Multi-city') {
    compareLeg('nextFrom', 'nextTo', 'nextDeparture', values.departure)
    let previous = values.nextDeparture
    for (let leg = 3; leg <= Math.min(5, 2 + (values.extraFlights ?? 0)); leg++) {
      compareLeg(`leg${leg}From`, `leg${leg}To`, `leg${leg}Date`, previous)
      previous = values[`leg${leg}Date`]
    }
  }
  if (service === 'hotels' && isCalendarDate(values.checkOut) && isCalendarDate(values.checkIn) && values.checkOut <= values.checkIn) errors.checkOut = 'Check-out must be after check-in.'
  if (service === 'inbound_india' && isCalendarDate(values.arrival) && isCalendarDate(values.departure) && values.departure <= values.arrival) errors.departure = 'Departure must be after arrival.'
  return errors
}

export function validateService(service, values, today) {
  return Object.values(validateTravel(service, values, today))[0] ?? ''
}

// Route state remains structured. This function never copies contact information
// or operational fields such as status, assignee or internal notes.
export function createEnquiryContext(serviceType, travel = {}, metadata = {}) {
  travel = travel && typeof travel === 'object' ? travel : {}
  metadata = metadata && typeof metadata === 'object' ? metadata : {}
  const clean = {}
  if (isServiceType(serviceType)) {
    for (const field of getServiceFields(serviceType, travel)) {
      if (typeof travel[field.name] === 'string') clean[field.name] = travel[field.name].slice(0, field.maxLength ?? 160)
      else if (field.type === 'number' && Number.isInteger(travel[field.name])) clean[field.name] = String(travel[field.name])
    }
    if (serviceType === 'flights' && travel.tripType === 'Multi-city' && Number.isInteger(travel.extraFlights)) clean.extraFlights = Math.max(0, Math.min(3, travel.extraFlights))
  }
  const context = {}
  for (const key of ['sourcePath', 'packageSlug', 'destination', 'experience']) {
    if (typeof metadata[key] === 'string') context[key] = metadata[key].slice(0, 200)
  }
  return { serviceType: isServiceType(serviceType) ? serviceType : '', travel: clean, metadata: context }
}

export function createEnquiryDraft(service, values) {
  const label = enquiryServices.find(item => item.key === service)?.label ?? 'Travel'
  return `${label} enquiry\n\n${getServiceFields(service, values).map(field => `${field.label}: ${String(values[field.name] ?? '').trim()}`).join('\n')}\n\nAdditional preferences: `
}
