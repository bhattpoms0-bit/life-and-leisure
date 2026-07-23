import DestinationHero from '../components/ui/DestinationHero'
import TierComparisonSection from '../components/ui/TierComparisonSection'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1745781230148-cd467af9ac58', { w: 1920 })

const TIERS = [
  {
    key: 'discover',
    badge: null,
    name: 'Discover Thailand',
    tagline: 'Budget',
    image: unsplashImage('1720655258819-db7f54b7bb28', { w: 900 }),
    imageAlt: 'Colorful wooden boats crowding a canal at a traditional Thai floating market.',
    duration: '5 Nights / 6 Days',
    hotelStar: '3-Star Hotels',
    price: '₹49,999',
    cities: ['Pattaya', 'Bangkok'],
    experiences: ['Coral Island tour and beach activities', 'Safari World and Marine Park', 'Chao Phraya dinner cruise'],
    to: '/packages/discover-thailand',
    highlighted: false,
  },
  {
    key: 'experience',
    badge: 'Most Popular',
    name: 'Experience Thailand',
    tagline: 'Mid-Range',
    image: unsplashImage('1576311510484-ab9fbdb2a47e', { w: 900 }),
    imageAlt: 'Ancient brick temple ruins under a clear sky in Ayutthaya, Thailand.',
    duration: '6 Nights / 7 Days',
    hotelStar: '4-Star Hotels',
    price: '₹79,999',
    cities: ['Pattaya', 'Bangkok', 'Ayutthaya'],
    experiences: ['Ayutthaya UNESCO heritage tour', 'Thai cooking class', 'Nong Nooch Tropical Garden cultural show'],
    to: null,
    highlighted: true,
  },
  {
    key: 'luxury',
    badge: null,
    name: 'Luxury Thailand Escape',
    tagline: 'Premium',
    image: unsplashImage('1745781230148-cd467af9ac58', { w: 900 }),
    imageAlt: 'Turquoise water framed by limestone cliffs at Maya Bay, Phi Phi Islands.',
    duration: '8 Nights / 9 Days',
    hotelStar: 'Luxury 5-Star Hotels',
    price: '₹1,65,000',
    cities: ['Bangkok', 'Phuket', 'Phi Phi Islands'],
    experiences: ['Private Phi Phi Islands speedboat charter', 'Private sunset yacht cruise', 'Ethical elephant sanctuary experience'],
    to: '/packages/luxury-thailand-escape',
    highlighted: false,
  },
]

export default function ThailandDestination() {
  return (
    <div>
      <DestinationHero
        image={HERO_IMAGE}
        badge="Thailand"
        headline="Temples, Islands, and Endless Coastline"
        subheading="A curated journey through Bangkok, Pattaya, Phuket, and the Phi Phi Islands — where golden temples, floating markets, and turquoise island bays meet modern luxury."
      />
      <TierComparisonSection heading="Three Ways to Experience Thailand" tiers={TIERS} />
    </div>
  )
}
