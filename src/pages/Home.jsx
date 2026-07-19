import { Link } from 'react-router-dom'
import GlassSearchBar from '../components/ui/GlassSearchBar'
import DestinationCard from '../components/ui/DestinationCard'
import StarRating from '../components/ui/StarRating'
import Reveal from '../components/ui/Reveal'
import { destinations } from '../data/destinations'
import { testimonials } from '../data/testimonials'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1781455495358-b38f1f2bad0b', { w: 1920 })
const VISA_IMAGE = unsplashImage('1646303297330-17073f7823c3', { w: 1200 })

const CATEGORIES = [
  { icon: 'favorite', title: 'Honeymoon', description: 'Romantic getaways' },
  { icon: 'landscape', title: 'Adventure', description: 'Off the beaten path' },
  { icon: 'business_center', title: 'Corporate', description: 'Elite business travel' },
  { icon: 'groups', title: 'Group Tours', description: 'Shared experiences' },
]

const TRUST_SIGNALS = [
  { icon: 'public', label: '150+ Destinations' },
  { icon: 'support_agent', label: '24/7 Concierge' },
  { icon: 'sentiment_satisfied', label: '98% Client Satisfaction' },
  { icon: 'lock', label: 'Secure Booking' },
]

const VALUE_PROPS = [
  {
    icon: 'verified_user',
    title: 'Vetted Luxury',
    description:
      'Every destination and property is personally inspected to ensure it meets our rigorous standards for comfort and exclusivity.',
  },
  {
    icon: 'support_agent',
    title: '24/7 Concierge',
    description:
      'A dedicated lifestyle manager is available around the clock to handle every detail of your journey, from dinner reservations to private jets.',
  },
  {
    icon: 'auto_awesome',
    title: 'Tailored Itineraries',
    description:
      'No two travelers are alike. We design unique, personalized experiences that align perfectly with your preferences and passions.',
  },
]

const VISA_FEATURES = [
  'Expedited Processing Options',
  'Corporate & Diplomatic Specialist Support',
  'Door-to-Door Document Delivery',
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[1024px] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 text-center px-gutter max-w-4xl">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-md drop-shadow-lg">
            The Art of <br />
            <span className="italic font-light">Extraordinary</span> Travel
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 mb-xl max-w-2xl mx-auto drop-shadow-md">
            Curation for the discerning explorer. We craft bespoke journeys that transcend the ordinary and redefine
            the essence of global exploration.
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-container-max px-gutter z-20">
          <GlassSearchBar />
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-surface-container-low border-b border-outline-variant/30 py-md">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-md">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.label} className="flex items-center justify-center gap-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-lg">{signal.icon}</span>
              <span className="font-label-md text-caption uppercase tracking-wide">{signal.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Categories */}
      <section className="py-xxl bg-white">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="group flex flex-col items-center text-center p-xl rounded-2xl hover:bg-surface-container-low transition-colors duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-headline-md text-body-md font-bold mb-xs">{category.title}</h3>
                <p className="font-body-md text-caption text-on-surface-variant">{category.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Featured Destinations */}
      <section className="py-xxl bg-surface-container-low">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                Global Portfolio
              </span>
              <h2 className="font-display-lg text-headline-lg text-primary mt-xs">Curated Destinations</h2>
            </div>
            <Link
              className="font-label-md text-label-md text-primary flex items-center hover:translate-x-1 transition-transform"
              to="/destinations"
            >
              View All <span className="material-symbols-outlined ml-xs">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} to="/packages" {...destination} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Why Choose Us */}
      <section className="py-xxl bg-white">
        <Reveal className="max-w-container-max mx-auto px-gutter text-center mb-xl">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Our Excellence</span>
          <h2 className="font-display-lg text-headline-lg text-primary mt-xs">Unrivaled Standards</h2>
        </Reveal>
        <Reveal className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-xl">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex flex-col items-center text-center">
              <div className="mb-lg">
                <span className="material-symbols-outlined text-primary text-5xl">{prop.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-md">{prop.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant px-lg">{prop.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Visa Assistance Section */}
      <section className="py-xxl bg-primary-container text-on-primary">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="bg-surface-container/10 backdrop-blur-sm rounded-[32px] p-xl md:p-xxl flex flex-col md:flex-row items-center gap-xl border border-white/10">
            <div className="flex-1 space-y-md">
              <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest">
                Seamless Mobility
              </span>
              <h2 className="font-display-lg text-display-lg text-white">Global Visa Assistance</h2>
              <p className="font-body-lg text-body-lg text-white/80">
                Leave the complexities of international travel to us. Our elite visa concierge manages every
                document, appointment, and detail for over 150 destinations worldwide.
              </p>
              <ul className="space-y-sm">
                {VISA_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center space-x-md font-body-md">
                    <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                className="inline-block mt-lg bg-secondary-container text-on-secondary-container px-xxl py-md rounded-xl font-headline-md hover:scale-105 transition-transform"
                to="/visa"
              >
                Get Started
              </Link>
            </div>
            <div className="flex-1 w-full aspect-square md:aspect-auto h-[400px] md:h-[500px] rounded-[24px] overflow-hidden">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${VISA_IMAGE}')` }} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="py-xxl bg-background">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Our Clients</span>
            <h2 className="font-display-lg text-headline-lg text-primary mt-xs">Traveler Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-xl rounded-[24px] editorial-shadow flex flex-col justify-between">
                <div>
                  <StarRating rating={testimonial.rating} className="mb-md" />
                  <p className="font-body-lg text-body-lg italic text-on-surface mb-lg">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center space-x-md">
                  <img className="w-14 h-14 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.avatarAlt} />
                  <div>
                    <p className="font-headline-md text-body-md font-bold">{testimonial.name}</p>
                    <p className="font-caption text-caption text-on-surface-variant">{testimonial.role}</p>
                    <p className="font-caption text-caption text-on-surface-variant/70 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                      Verified Traveler · {testimonial.destination}, {testimonial.tripDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}
