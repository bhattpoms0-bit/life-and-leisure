import { createEnquiryContext } from '../lib/serviceEnquiry'
import { SERVICES, serviceCardEnquiry } from '../data/serviceCatalogue'
import { Link } from 'react-router-dom'
import Reveal from '../components/ui/Reveal'
import PageMeta from '../components/seo/PageMeta'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1759038086646-caeed927e000', { w: 1920 })

export default function Services() {
  return (
    <div>
      <PageMeta
        title="Our Services | Life and Leisure"
        description="From bespoke itinerary planning to personal travel support, visa assistance, private transfers, and worldwide air ticketing — explore every service behind a Life and Leisure journey."
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
                  <Link
                    to="/contact"
                    state={{ enquiry: serviceCardEnquiry(service) }}
                    aria-label={`Enquire about ${service.title}`}
                    className="mt-md inline-flex items-center gap-1 font-label-md text-caption text-secondary"
                  >
                    Enquire about this service <span aria-hidden="true">→</span>
                  </Link>
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
                state={{ enquiry: createEnquiryContext('travel_consultation', {}, { sourcePath: '/services' }) }}
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
