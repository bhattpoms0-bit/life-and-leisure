// Parses a formatted price string like "₹79,999" or "$6,800" into its
// currency symbol and numeric amount, so seasonal pricing tiers can be
// recomputed (subtotal/taxes/total) without hardcoding a breakdown per tier.
export function parsePrice(priceStr) {
  const match = priceStr.match(/^([^\d]*)([\d,]+)/)
  if (!match) return null
  return { symbol: match[1].trim(), amount: parseInt(match[2].replace(/,/g, ''), 10) }
}

// Indian numbering groups the first 3 digits from the right, then pairs of 2
// (e.g. 230000 -> "2,30,000"), unlike the uniform groups-of-3 used elsewhere.
function formatIndianGrouping(amount) {
  const s = String(amount)
  if (s.length <= 3) return s
  const last3 = s.slice(-3)
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `${rest},${last3}`
}

export function formatPrice(symbol, amount) {
  if (symbol === '₹') return `₹${formatIndianGrouping(amount)}`
  return `${symbol}${amount.toLocaleString('en-US')}`
}

// Mirrors the site's existing per-person pricing convention: subtotal is
// priced for 2 travelers, taxes are a flat 10% of the per-person price.
export function computeBreakdown(priceStr) {
  const parsed = parsePrice(priceStr)
  if (!parsed) return null
  const { symbol, amount } = parsed
  const subtotal = amount * 2
  const taxes = Math.round(amount * 0.1)
  return {
    subtotal: formatPrice(symbol, subtotal),
    taxes: formatPrice(symbol, taxes),
    total: formatPrice(symbol, subtotal + taxes),
  }
}
