export const PRICING_DISCLAIMER = 'Final quotation depends on travel dates, availability, occupancy and applicable charges.'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Existing catalogue dates use "Mon D - Mon D, YYYY". Unknown formats are
// unconfirmed, never guessed. A departure is past once its start date has passed
// in India, even if the itinerary would still be in progress.
export function getDepartureStatus(travelDate, now = new Date()) {
  if (typeof travelDate !== 'string' || !(now instanceof Date) || !Number.isFinite(now.getTime())) return 'unconfirmed'
  const match = /^([A-Z][a-z]{2}) (\d{1,2}) - ([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/.exec(travelDate)
  if (!match) return 'unconfirmed'
  const [, startMonth, startDay, endMonth, endDay, year] = match
  const toDate = (month, day) => {
    const index = MONTHS.indexOf(month)
    if (index < 0) return null
    const iso = `${year}-${String(index + 1).padStart(2, '0')}-${day.padStart(2, '0')}`
    const parsed = new Date(`${iso}T00:00:00Z`)
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso ? iso : null
  }
  const start = toDate(startMonth, startDay), end = toDate(endMonth, endDay)
  if (!start || !end || end < start) return 'unconfirmed'
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return start < today ? 'expired' : 'scheduled'
}
