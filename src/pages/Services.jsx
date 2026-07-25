import { Link } from 'react-router-dom'
import Reveal from '../components/ui/Reveal'
import PageMeta from '../components/seo/PageMeta'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1759038086646-caeed927e000', { w: 1920 })

const SERVICES = [
  {
    icon: 'edit_calendar',
    title: 'Bespoke Itinerary Planning',
    description: 'Fully custom trip design, tailored to your preferences, pace, and interests — no templates, no shortcuts.',
    image: unsplashImage('1504609773096-104ff2c73ba4', { w: 700 }),
    imageAlt: 'A flat-lay desk scene with map-patterned travel journals, a compass, and a pencil on a wooden table.',
  },
  {
    icon: 'support_agent',
    title: '24/7 Concierge Support',
    description: 'A dedicated lifestyle manager on call throughout your journey, from dinner reservations to last-minute changes.',
    image: unsplashImage('1766066014237-00645c74e9c6', { w: 700 }),
    imageAlt: 'A smiling concierge wearing a headset at her desk, ready to assist a traveler.',
  },
  {
    icon: 'description',
    title: 'Visa & Documentation Assistance',
    description: 'Expert visa processing for 150+ destinations.',
    learnMoreTo: '/visa',
    image: unsplashImage('1586441133374-ed1cb4007a47', { w: 700 }),
    imageAlt: 'A passport and boarding pass arranged on a travel bag.',
  },
  {
    icon: 'airport_shuttle',
    title: 'Private Transfers & Chauffeur Services',
    description: 'Seamless airport pickups, city transfers, and private drivers at every stop.',
    image: unsplashImage('1780296269675-169390638617', { w: 700 }),
    imageAlt: 'A polished black Mercedes-Benz S-Class sedan, ready for a private chauffeur transfer.',
  },
  {
    icon: 'hotel',
    title: 'Luxury Accommodation Curation',
    description: 'Hand-vetted hotels and villas, personally inspected for comfort and exclusivity.',
    image: unsplashImage('1544984243-ec57ea16fe25', { w: 700 }),
    imageAlt: 'A modern villa with a private pool overlooking the desert at a vivid pink-and-orange sunset.',
  },
  {
    icon: 'favorite',
    title: 'Honeymoon & Special Occasion Planning',
    description: 'Thoughtfully designed celebrations for anniversaries, proposals, and milestone moments.',
    image: unsplashImage('1603894309519-f4391826a2fd', { w: 700 }),
    imageAlt: 'A couple silhouetted against the sunset, embracing while standing in shallow water on a beach.',
  },
  {
    icon: 'business_center',
    title: 'Corporate & Group Travel',
    description: 'Incentive trips, offsites, and seamless coordination for multi-traveler journeys.',
    image: unsplashImage('1532968899863-5b52ef155913', { w: 700 }),
    imageAlt: 'A group of business travelers with rolling luggage walking through a sunlit airport terminal.',
  },
  {
    icon: 'alt_route',
    title: 'Multi-Destination Trip Design',
    description: 'Combine countries and regions into one seamlessly connected itinerary.',
    image: unsplashImage('1516738901171-8eb4fc13bd20', { w: 700 }),
    imageAlt: 'A world map with colorful pins marking multiple destinations across Southeast Asia.',
  },
  {
    icon: 'connecting_airports',
    title: 'Worldwide Air Ticketing',
    description: 'Domestic and international flight booking across every major airline, handled end-to-end by our team.',
    image: unsplashImage('1745562313458-21fe14ef50a6', { w: 700 }),
    imageAlt: 'The sun setting over an airport tarmac and control tower, with an aircraft taxiing in the distance.',
  },
  {
    icon: 'flight',
    title: 'Domestic Ticketing',
    description: 'Fast, reliable domestic flight bookings across India, with fare tracking and schedule support.',
    image: unsplashImage('1756535789308-8523b9ee209d', { w: 700 }),
    imageAlt: 'View of an airplane wing above the clouds during a warm orange sunset.',
  },
]

export default function Services() {
  return (
    <div>
      <PageMeta
        title="Our Services | Life and Leisure"
        description="From bespoke itinerary planning to 24/7 concierge support, visa assistance, private transfers, and worldwide air ticketing — explore every service behind a Life and Leisure journey."
      />

      {/* Hero Section */}
      <section className="relative h-[560px] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative h-full max-w-container-max mx-auto px-gutter flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl space-y-md">
            <span className="inline-block px-md py-xs bg-secondary/90 text-white rounded-full font-label-md tracking-widest uppercase">
              How We Help
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white">Service, Redefined</h1>
            <p className="font-body-lg text-body-lg text-white/85 max-w-xl mx-auto">
              Every journey we craft is backed by dedicated support, from the first idea to the final transfer home.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-xxl bg-white">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col text-center bg-white rounded-2xl border border-outline-variant/20 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={service.image}
                    alt={service.imageAlt}
                  />
                </div>
                <div className="flex flex-col items-center p-lg md:p-xl -mt-8 relative">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed border-4 border-white flex items-center justify-center mb-md shadow-md group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold mb-xs text-primary">{service.title}</h3>
                  <p className="font-body-md text-caption text-on-surface-variant">{service.description}</p>
                  {service.learnMoreTo && (
                    <Link
                      to={service.learnMoreTo}
                      className="mt-md inline-flex items-center gap-1 font-label-md text-caption text-secondary hover:translate-x-1 transition-transform"
                    >
                      Learn more
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA Section */}
      <section className="py-xxl bg-surface-container-low">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="relative rounded-[40px] overflow-hidden p-xxl text-center bg-gradient-to-br from-primary via-primary-container to-primary">
            <div className="relative z-20 max-w-2xl mx-auto">
              <h2 className="font-display-lg text-headline-lg text-white mb-lg">Have Something Specific in Mind?</h2>
              <p className="text-white/80 text-body-lg mb-xxl">
                Every traveler is different. Reach out and one of our specialists will help shape the right service for
                your trip.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-secondary-container text-on-secondary-container px-xxl py-5 rounded-2xl font-headline-md text-headline-md hover:scale-105 transition-transform duration-300 shadow-xl"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
