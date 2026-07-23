import DestinationHero from '../components/ui/DestinationHero'
import TierComparisonSection from '../components/ui/TierComparisonSection'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1639458110591-17c4cede0c4b', { w: 1920 })

const TIERS = [
  {
    key: 'discover',
    badge: null,
    name: 'Discover Vietnam',
    tagline: 'Budget',
    image: unsplashImage('1747137129095-b693a7ad08d0', { w: 900 }),
    imageAlt: 'The Golden Bridge held aloft by giant stone hands at Ba Na Hills, Da Nang.',
    duration: '6 Nights / 7 Days',
    hotelStar: '3-Star Hotels',
    price: '₹38,999',
    cities: ['Hanoi', 'Ha Long Bay', 'Da Nang'],
    experiences: ['Ha Long Bay cruise and kayaking', 'Ba Na Hills and Golden Bridge', 'Hoi An lantern streets'],
    to: '/packages/discover-vietnam',
    highlighted: false,
  },
  {
    key: 'experience',
    badge: 'Most Popular',
    name: 'Experience Vietnam',
    tagline: 'Mid-Range',
    image: unsplashImage('1761127138372-cad230082b19', { w: 900 }),
    imageAlt: 'Limestone karsts rising from the emerald waters of Ha Long Bay, Vietnam.',
    duration: '7 Nights / 8 Days',
    hotelStar: '4-Star Hotels',
    price: '₹62,999',
    cities: ['Hanoi', 'Ninh Binh', 'Ha Long Bay', 'Da Nang', 'Hoi An'],
    experiences: ['Trang An boat ride and Mua Cave', 'Premium Ha Long Bay cruise', 'Hoi An lantern boat ride'],
    to: null,
    highlighted: true,
  },
  {
    key: 'indulge',
    badge: null,
    name: 'Indulge in Vietnam',
    tagline: 'Premium',
    image: unsplashImage('1639458110591-17c4cede0c4b', { w: 900 }),
    imageAlt: 'A room filled with glowing traditional lanterns in Hoi An, Vietnam.',
    duration: '8 Nights / 9 Days',
    hotelStar: 'Luxury 5-Star Hotels',
    price: '₹1,15,000',
    cities: ['Hanoi', 'Ha Long Bay', 'Hoi An', 'Da Nang', 'Ho Chi Minh City'],
    experiences: ['VIP airport meet & greet', 'Luxury overnight Ha Long Bay cruise', 'Private lantern boat & cooking class'],
    to: '/packages/indulge-in-vietnam',
    highlighted: false,
  },
]

export default function VietnamDestination() {
  return (
    <div>
      <DestinationHero
        image={HERO_IMAGE}
        badge="Vietnam"
        headline="From Ancient Towns to Emerald Bays"
        subheading="A curated journey through Hanoi, Ha Long Bay, Da Nang, Hoi An, and Ho Chi Minh City — where limestone karsts, lantern-lit lanes, and centuries of heritage meet modern luxury."
      />
      <TierComparisonSection heading="Three Ways to Experience Vietnam" tiers={TIERS} />
    </div>
  )
}
