import { Link } from 'react-router-dom'
import Reveal from '../components/ui/Reveal'
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
      {/* Hero Section */}
      <section className="relative h-[720px] min-h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative h-full max-w-container-max mx-auto px-gutter flex flex-col justify-end pb-xxl">
          <div className="max-w-2xl space-y-md">
            <span className="inline-block px-md py-xs bg-secondary/90 text-white rounded-full font-label-md tracking-widest uppercase">
              Vietnam
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
              From Ancient Towns to Emerald Bays
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-xl">
              A curated journey through Hanoi, Ha Long Bay, Da Nang, Hoi An, and Ho Chi Minh City — where limestone
              karsts, lantern-lit lanes, and centuries of heritage meet modern luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="max-w-container-max mx-auto px-gutter py-xxl">
        <Reveal className="text-center mb-xl max-w-2xl mx-auto">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
            Choose Your Journey
          </span>
          <h2 className="font-display-lg text-headline-lg text-primary mt-xs">Three Ways to Experience Vietnam</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
          {TIERS.map((tier) => (
            <Reveal key={tier.key} className="relative h-full">
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-lg py-xs bg-secondary text-white rounded-full font-label-md text-caption tracking-widest uppercase shadow-md">
                  {tier.badge}
                </span>
              )}
              <div
                className={`relative bg-white rounded-xxl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full ${
                  tier.highlighted
                    ? 'border-2 border-secondary shadow-xl md:-translate-y-2'
                    : 'border border-outline-variant/20 shadow-sm'
                }`}
              >
              <div className="h-56 overflow-hidden relative">
                <img className="w-full h-full object-cover" src={tier.image} alt={tier.imageAlt} />
                <div className="absolute top-md right-md glass-card px-md py-xs rounded-full font-label-md text-caption font-bold text-primary">
                  {tier.hotelStar}
                </div>
              </div>

              <div className="p-lg flex flex-col flex-1 space-y-md">
                <div>
                  <span className="font-label-md text-caption text-secondary uppercase tracking-widest">
                    {tier.tagline}
                  </span>
                  <h3 className="font-headline-lg text-headline-md text-primary mt-xs">{tier.name}</h3>
                  <div className="flex items-center gap-xs text-on-surface-variant mt-xs">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-body-md text-caption">{tier.duration}</span>
                  </div>
                </div>

                <div className="flex items-start gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">location_on</span>
                  <span className="font-body-md text-caption">{tier.cities.join(' · ')}</span>
                </div>

                <div className="space-y-xs">
                  <span className="font-label-md text-caption text-on-surface uppercase tracking-wider">
                    Top Experiences
                  </span>
                  <ul className="space-y-xs">
                    {tier.experiences.map((experience) => (
                      <li key={experience} className="flex items-start gap-xs">
                        <span className="material-symbols-outlined text-[16px] text-primary-fixed mt-0.5">
                          check_circle
                        </span>
                        <span className="font-body-md text-caption text-on-surface-variant">{experience}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1" />

                <div className="pt-md border-t border-outline-variant/30">
                  <div className="flex items-baseline justify-between mb-md">
                    <span className="font-label-md text-caption text-outline uppercase tracking-wider">
                      Per Person
                    </span>
                    <span className="font-headline-md text-headline-md text-secondary">{tier.price}</span>
                  </div>
                  {tier.to ? (
                    <Link
                      to={tier.to}
                      className={`block w-full text-center py-md rounded-lg font-label-md transition-colors ${
                        tier.highlighted
                          ? 'bg-secondary text-white hover:bg-secondary-container'
                          : 'bg-primary text-on-primary hover:bg-primary-container'
                      }`}
                    >
                      View Full Itinerary
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => console.log('Enquire:', tier.name)}
                      className="block w-full text-center py-md rounded-lg font-label-md bg-secondary text-white hover:bg-secondary-container transition-colors"
                    >
                      Enquire Now
                    </button>
                  )}
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
