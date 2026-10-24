export const services = [
  { key: 'flights', label: 'Flights', icon: 'flight', action: 'Request Flight Quote' },
  { key: 'hotels', label: 'Hotels', icon: 'hotel', action: 'Request Hotel Quote' },
  { key: 'trains', label: 'Trains', icon: 'train', action: 'Request Train Assistance' },
  { key: 'visa', label: 'Visa', icon: 'travel_explore', action: 'Check Visa Assistance' },
  { key: 'holidays', label: 'Holidays', icon: 'beach_access', action: 'Explore Holidays' },
]

const text = (name, label, placeholder) => ({ name, label, placeholder, type: 'text' })
const date = (name, label) => ({ name, label, type: 'date' })
const number = (name, label, max = 20) => ({ name, label, type: 'number', min: 1, max })
const select = (name, label, options) => ({ name, label, type: 'select', options })

export function getServiceFields(service, values = {}) {
  switch (service) {
    case 'flights': return [
      text('from', 'From', 'City or airport'), text('to', 'To', 'City or airport'),
      select('tripType', 'Trip type', ['Return', 'One-way', 'Multi-city']),
      date('departure', 'Departure date'),
      ...(values.tripType === 'Return' ? [date('return', 'Return date')] : []),
      ...(values.tripType === 'Multi-city' ? [text('nextFrom', 'Next flight from', 'City or airport'), text('nextTo', 'Next flight to', 'City or airport'), date('nextDeparture', 'Next departure')] : []),
      number('passengers', 'Passengers'), select('cabin', 'Cabin class', ['Economy', 'Premium Economy', 'Business', 'First']),
    ]
    case 'hotels': return [text('destination', 'Destination', 'City or region'), date('checkIn', 'Check-in'), date('checkOut', 'Check-out'), number('rooms', 'Rooms', 10), number('guests', 'Guests')]
    case 'trains': return [text('from', 'Departure station', 'Station or city'), text('to', 'Arrival station', 'Station or city'), date('departure', 'Travel date'), select('class', 'Travel class', ['Please advise me', 'Sleeper', 'AC 3 Tier', 'AC 2 Tier', 'AC First Class', 'AC Chair Car', 'Executive Chair Car']), number('passengers', 'Passengers')]
    case 'visa': return [text('destination', 'Destination country', 'Where are you travelling?'), text('nationality', 'Passport nationality', 'As shown on your passport'), select('purpose', 'Purpose of travel', ['Tourism', 'Business', 'Family visit', 'Other — please advise'])]
    case 'holidays': return [text('destination', 'Destination', 'A country, region or idea'), { name: 'month', label: 'Travel month', type: 'month' }, number('travellers', 'Travellers'), text('budget', 'Budget & currency', 'e.g. INR 1,00,000 for two')]
    default: return []
  }
}

export function validateService(service, values, today) {
  const fields = getServiceFields(service, values)
  for (const field of fields) {
    const value = String(values[field.name] ?? '').trim()
    if (!value) return `Please enter ${field.label.toLowerCase()}.`
    if (field.type === 'number' && (!Number.isInteger(Number(value)) || Number(value) < field.min || Number(value) > field.max)) return `${field.label} must be between ${field.min} and ${field.max}.`
    if (field.type === 'select' && !field.options.includes(value)) return `Please choose a valid ${field.label.toLowerCase()}.`
    if (field.type === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today)) return 'Please choose a travel date today or later.'
    if (field.type === 'month' && (!/^\d{4}-\d{2}$/.test(value) || value < today.slice(0, 7))) return 'Please choose this month or a later month.'
  }
  if (values.from && values.to && values.from.trim().toLowerCase() === values.to.trim().toLowerCase()) return 'Departure and arrival must be different.'
  if (service === 'flights' && values.tripType === 'Return' && values.return < values.departure) return 'Return date must be on or after departure.'
  if (service === 'flights' && values.tripType === 'Multi-city') {
    if (values.nextFrom.trim().toLowerCase() === values.nextTo.trim().toLowerCase()) return 'The next flight needs different departure and arrival locations.'
    if (values.nextDeparture < values.departure) return 'The next flight must depart on or after the first flight.'
  }
  if (service === 'hotels' && values.checkOut <= values.checkIn) return 'Check-out must be after check-in.'
  return ''
}

export function createEnquiryDraft(service, values) {
  const label = services.find(item => item.key === service)?.label ?? 'Travel'
  return `${label} enquiry\n\n${getServiceFields(service, values).map(field => `${field.label}: ${String(values[field.name] ?? '').trim()}`).join('\n')}\n\nAdditional preferences: `
}
