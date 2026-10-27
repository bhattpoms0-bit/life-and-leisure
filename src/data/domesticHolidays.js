import { createEnquiryContext } from '../lib/serviceEnquiry'

export const KERALA_PRICING_CONDITIONS = [
  'Provisional land-only commercial targets, not confirmed selling prices. Subject to final quotation.',
  'Based on a minimum of four adults sharing twin/double accommodation.',
  'Prices depend on season, hotel availability, room category and supplier quotations.',
  'Two-person and family pricing must be quoted separately. No flights included.',
]

export const KERALA_EXCLUSIONS = [
  'Domestic or international flights.',
  'Travel to and from Kochi outside the stated itinerary.',
  'Travel insurance.',
  'Meals not specifically included.',
  'Personal expenses and shopping.',
  'Optional activities and upgrades.',
  'Additional Ayurveda treatments.',
  'Charges not expressly included in the final quotation.',
]

export const keralaPackages = [
  {
    slug: 'kerala-classic', tier: 'Base', title: 'Kerala Classic — Hills, Spices & Backwaters',
    days: 6, nights: 5, amount: 29999, currency: 'INR', price: '₹29,999',
    accommodation: 'Comfortable 3-star hotels',
    route: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey', 'Kochi'],
    description: 'Tea-country mornings, a spice-garden visit and a scheduled backwater cruise, with a private vehicle connecting the journey.',
    image: '/images/kerala/munnar-tea.jpg', imageAlt: 'Tea bushes and shade trees on a hillside in Munnar, Kerala.', imagePosition: 'center 78%',
    highlights: ['Munnar sightseeing', 'Spice-garden visit', 'Scheduled backwater cruise'],
    itinerary: [
      { day: 1, title: 'Kochi to Munnar', body: 'Arrive at Kochi Airport in the morning. Private transfer to Munnar, check in and relax.', overnight: 'Munnar' },
      { day: 2, title: 'Munnar tea country', body: 'Munnar sightseeing, including tea plantations, the Mattupetty area and scenic viewpoints.', overnight: 'Munnar' },
      { day: 3, title: 'Munnar to Thekkady', body: 'Travel to Thekkady with an included spice-garden visit. A cultural performance is optional.', overnight: 'Thekkady' },
      { day: 4, title: 'Thekkady to Alleppey', body: 'Transfer to Alleppey for an included scheduled backwater cruise.', overnight: 'Alleppey' },
      { day: 5, title: 'Alleppey to Kochi', body: 'Travel to Kochi for Fort Kochi sightseeing and local attractions.', overnight: 'Kochi' },
      { day: 6, title: 'Departure from Kochi', body: 'Breakfast and private airport transfer for departure.' },
    ],
    inclusions: ['Five nights’ accommodation.', 'Daily breakfast.', 'Private AC vehicle for the agreed itinerary.', 'Airport pickup and drop-off.', 'Driver expenses, parking and standard route tolls.', 'Spice-garden visit.', 'Scheduled backwater cruise.', 'Travel coordination.'],
    optional: 'Ayurvedic massage, cultural show, houseboat upgrade, room upgrades and additional activities are optional and quoted separately.',
  },
  {
    slug: 'kerala-serenity', tier: 'Signature', title: 'Kerala Serenity Escape',
    days: 6, nights: 5, amount: 44999, currency: 'INR', price: '₹44,999',
    accommodation: 'Premium 3/4-star hotels or quality boutique resorts',
    route: ['Kochi', 'Munnar', 'Thekkady', 'Kumarakom', 'Kochi'],
    description: 'Guided tea and spice experiences, a Kumarakom resort stay and a thoughtful balance of heritage, backwaters and relaxation.',
    image: '/images/kerala/munnar-valley.jpg', imageAlt: 'Tea estates and a mist-filled valley in Munnar, Kerala.', imagePosition: 'center',
    highlights: ['Guided tea experience', 'Kumarakom backwaters', 'One 60-minute relaxation massage'],
    itinerary: [
      { day: 1, title: 'Kochi to Munnar', body: 'Private transfer from Kochi Airport to Munnar and check-in to premium accommodation.', overnight: 'Munnar' },
      { day: 2, title: 'A guided tea-country experience', body: 'Explore Munnar with a guided tea-country experience, selected sightseeing and time to relax.', overnight: 'Munnar' },
      { day: 3, title: 'Munnar to Thekkady', body: 'Travel to Thekkady for a guided spice-garden experience and an included cultural performance, subject to availability.', overnight: 'Thekkady' },
      { day: 4, title: 'Thekkady to Kumarakom', body: 'Check in to a premium backwater resort. One prebooked 60-minute Ayurvedic relaxation massage per adult is included, subject to practitioner screening, guest consent and scheduling.', overnight: 'Kumarakom' },
      { day: 5, title: 'Backwaters to Fort Kochi', body: 'Enjoy a curated Kumarakom backwater experience, then transfer to Kochi for a guided Fort Kochi heritage experience and one specified regional dining experience.', overnight: 'Kochi' },
      { day: 6, title: 'Departure from Kochi', body: 'Breakfast and private airport transfer for departure.' },
    ],
    inclusions: ['Five nights in premium accommodation.', 'Daily breakfast.', 'Private AC transport.', 'Guided tea experience.', 'Guided spice-garden experience.', 'Cultural performance, subject to availability.', 'One prebooked 60-minute Ayurvedic relaxation massage per adult, subject to practitioner screening, guest consent and scheduling.', 'Curated backwater experience.', 'Guided Kochi heritage experience.', 'One specified regional dining experience.', 'Travel coordination.'],
  },
  {
    slug: 'kerala-private-luxury', tier: 'Premium', title: 'Kerala Private Luxury Journey',
    days: 7, nights: 6, amount: 74999, currency: 'INR', price: '₹74,999',
    accommodation: 'Selected premium 4/5-star or luxury boutique resorts',
    route: ['Kochi', 'Munnar', 'Thekkady', 'Kumarakom', 'Kochi'],
    description: 'A private Kerala journey with selected premium stays, guided local experiences and two nights beside Kumarakom’s backwaters.',
    image: '/images/kerala/kumarakom-backwaters.jpg', imageAlt: 'Palm leaves and reflections over the calm Kumarakom backwaters in Kerala.', imagePosition: 'center',
    highlights: ['Private backwater cruise', 'Responsible village-life experience', 'Two curated wellness sessions'],
    itinerary: [
      { day: 1, title: 'A welcome to Kochi', body: 'Kochi arrival and premium hotel check-in. A private heritage walk if arrival time permits, followed by a welcome dinner.', overnight: 'Kochi' },
      { day: 2, title: 'Kochi to Munnar', body: 'Scenic private transfer to Munnar and luxury resort check-in.', overnight: 'Munnar' },
      { day: 3, title: 'Private tea country & relaxation', body: 'Private guided tea-country experience and time to relax. A prearranged wellness session is optional to participate in; the package includes two curated sessions per consenting adult, subject to qualified-provider screening and availability.', overnight: 'Munnar' },
      { day: 4, title: 'Munnar to Thekkady', body: 'Private spice-country experience and an included cultural programme where available.', overnight: 'Thekkady' },
      { day: 5, title: 'Thekkady to Kumarakom', body: 'Travel to Kumarakom, check in to a luxury waterfront resort and relax.', overnight: 'Kumarakom' },
      { day: 6, title: 'Backwaters, culture & wellness', body: 'Breakfast at the resort. A curated village-life experience with a responsible local operator introduces traditional Kerala crafts, local livelihoods and village culture. Enjoy a private Kumarakom backwater cruise, a second curated Ayurvedic wellness session subject to guest consent, practitioner screening and availability, and a special farewell dinner.', overnight: 'Kumarakom' },
      { day: 7, title: 'Kumarakom to Kochi Airport', body: 'Breakfast, leisurely checkout and private transfer to Cochin International Airport. Allow approximately 2–3 hours for the road journey, plus airport reporting time. End of the tour.' },
    ],
    inclusions: ['Six nights in selected premium 4/5-star or luxury boutique accommodation.', 'Daily breakfast.', 'Private upgraded air-conditioned vehicle.', 'Kochi Airport pickup and drop-off.', 'Private Fort Kochi heritage experience.', 'Private guided tea-country experience in Munnar.', 'Guided spice-plantation experience in Thekkady.', 'Selected cultural performance, subject to schedule.', 'Two curated Ayurvedic wellness sessions per consenting adult, subject to qualified-provider screening and availability.', 'Private backwater cruise.', 'Responsible village-life experience in Kumarakom.', 'Specified welcome and farewell dining experiences.', 'Travel coordination and on-ground assistance.'],
  },
]

export const domesticPackagePath = pkg => `/domestic-holidays/kerala/${pkg.slug}`

// Uses the existing allowlisted holiday payload. Indicative pricing context is
// a preference, never the customer's budget, traveller count or a binding quote.
export function domesticEnquiryContext(pkg, sourcePath = domesticPackagePath(pkg)) {
  return createEnquiryContext('holidays', {
    destination: 'Kerala, India',
    preferences: `Indicative land-only target INR ${pkg.amount} pp; min 4 adults, twin/double; 2-person/family quote separately.`,
  }, { packageSlug: pkg.slug, destination: 'Kerala, India', experience: `Kerala ${pkg.tier}`, sourcePath })
}
