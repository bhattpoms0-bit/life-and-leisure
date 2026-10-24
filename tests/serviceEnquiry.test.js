import test from 'node:test'
import assert from 'node:assert/strict'
import { createEnquiryDraft, getServiceFields, services, validateService } from '../src/lib/serviceEnquiry.js'

const today = '2026-10-24'
const flight = { from: 'Delhi', to: 'Tokyo', tripType: 'Return', departure: '2026-12-10', return: '2026-12-20', passengers: '2', cabin: 'Economy' }

test('all five services accept complete enquiries', () => {
  const enquiries = {
    flights: flight,
    hotels: { destination: 'Kyoto', checkIn: '2026-12-10', checkOut: '2026-12-12', rooms: '1', guests: '2' },
    trains: { from: 'Delhi', to: 'Jaipur', departure: '2026-12-10', class: 'AC Chair Car', passengers: '2' },
    visa: { destination: 'Japan', nationality: 'Indian', purpose: 'Tourism' },
    holidays: { destination: 'Bali', month: '2026-12', travellers: '2', budget: 'INR 1,50,000 for two' },
  }
  assert.equal(services.length, 5)
  for (const [service, values] of Object.entries(enquiries)) assert.equal(validateService(service, values, today), '', service)
})

test('rejects missing values, whitespace, invalid counts and unrecognised options', () => {
  for (const override of [{ from: '' }, { from: '   ' }, { passengers: '0' }, { passengers: '1.5' }, { passengers: '21' }, { cabin: 'Invalid cabin' }]) assert.notEqual(validateService('flights', { ...flight, ...override }, today), '')
})

test('rejects past departures, reversed dates and identical locations', () => {
  assert.match(validateService('flights', { ...flight, departure: '2026-10-01' }, today), /today or later/)
  assert.match(validateService('flights', { ...flight, return: '2026-12-01' }, today), /Return date/)
  assert.match(validateService('flights', { ...flight, to: ' DELHI ' }, today), /different/)
})

test('one-way flights do not require or include an old return date', () => {
  const values = { ...flight, tripType: 'One-way', return: '2020-01-01' }
  assert.equal(validateService('flights', values, today), '')
  assert.equal(getServiceFields('flights', values).some(field => field.name === 'return'), false)
  assert.equal(createEnquiryDraft('flights', values).includes('2020-01-01'), false)
})

test('multi-city enquiries validate the second flight', () => {
  const values = { ...flight, tripType: 'Multi-city', nextFrom: 'Tokyo', nextTo: 'Osaka', nextDeparture: '2026-12-14' }
  assert.equal(validateService('flights', values, today), '')
  assert.match(validateService('flights', { ...values, nextDeparture: '2026-12-01' }, today), /next flight/)
  assert.match(validateService('flights', { ...values, nextTo: 'tokyo' }, today), /different/)
  assert.notEqual(validateService('flights', { ...values, nextTo: '' }, today), '')
})

test('hotel checkout must follow check-in', () => {
  const values = { destination: 'Kyoto', checkIn: '2026-12-10', checkOut: '2026-12-10', rooms: '1', guests: '2' }
  assert.match(validateService('hotels', values, today), /Check-out/)
})

test('holiday month must be current or later', () => {
  const values = { destination: 'India', month: '2026-09', travellers: '2', budget: 'Please advise' }
  assert.match(validateService('holidays', values, today), /later month/)
})

test('enquiry drafts include only the chosen service fields and preserve entered details', () => {
  const draft = createEnquiryDraft('visa', { destination: 'Japan', nationality: 'Indian', purpose: 'Tourism', departure: 'irrelevant', secret: 'not included' })
  assert.match(draft, /Visa enquiry/)
  assert.match(draft, /Destination country: Japan/)
  assert.match(draft, /Passport nationality: Indian/)
  assert.doesNotMatch(draft, /irrelevant|not included/)
  assert.doesNotMatch(draft, /booking confirmed|successfully submitted/i)
})
