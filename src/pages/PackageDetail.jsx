import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PackageCard from '../components/ui/PackageCard'
import Reveal from '../components/ui/Reveal'
import { packageDetails } from '../data/packageDetails'
import { packages } from '../data/packages'

const PASSENGER_OPTIONS = ['2 Adults', '1 Adult', '3 Adults', 'Group (4+)']

const GALLERY_SPAN_CLASSES = {
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  small: 'col-span-1 row-span-1',
}

export default function PackageDetail() {
  const { slug } = useParams()
  const pkg = packageDetails[slug]
  const [passengers, setPassengers] = useState(PASSENGER_OPTIONS[0])

  if (!pkg) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-xxl text-center space-y-md">
        <h1 className="font-headline-lg text-headline-lg text-primary">Package not found</h1>
        <p className="font-body-md text-on-surface-variant">This itinerary may have moved or is no longer available.</p>
        <Link className="inline-block text-primary font-label-md hover:translate-x-1 transition-transform" to="/packages">
          Browse all packages
        </Link>
      </div>
    )
  }

  const relatedPackages = packages.filter((p) => p.slug !== slug).slice(0, 3)

  const handleSecureSpot = () => {
    console.log('Secure your spot:', { slug, travelDate: pkg.travelDate, passengers })
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[716px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${pkg.heroImage}')` }} />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 flex flex-col justify-end pb-xl px-gutter">
          <div className="max-w-container-max mx-auto w-full">
            <div className="flex items-center space-x-2 text-primary-fixed mb-4">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="font-label-md text-label-md uppercase tracking-widest">{pkg.location}</span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white max-w-2xl">{pkg.title}</h1>
            <div className="flex items-center mt-6 space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined">schedule</span>
                <span className="font-body-md text-body-md">{pkg.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined">star</span>
                <span className="font-body-md text-body-md">
                  {pkg.rating.toFixed(1)} ({pkg.reviewCount} Reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-container-max mx-auto px-gutter py-xxl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-xl">
            {/* Highlights */}
            <div className="space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-primary">{pkg.highlightsTitle}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">{pkg.highlightsBody}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md pt-md">
                {pkg.features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex flex-col items-center p-md bg-surface-container-low rounded-xl border border-outline-variant/30 transition-transform hover:-translate-y-1"
                  >
                    <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: '32px' }}>
                      {feature.icon}
                    </span>
                    <span className="font-label-md text-caption text-center">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Grid (Bento Style) */}
            <div className="grid grid-cols-4 grid-rows-2 gap-md h-[500px]">
              {pkg.gallery.map((item, index) => (
                <div key={index} className={`${GALLERY_SPAN_CLASSES[item.span]} rounded-xxl overflow-hidden shadow-sm group`}>
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={item.image}
                    alt={item.alt}
                  />
                </div>
              ))}
            </div>

            {/* Itinerary Timeline */}
            <div className="space-y-lg">
              <h3 className="font-headline-md text-headline-md text-primary">Your Journey Itinerary</h3>
              <div className="space-y-0">
                {pkg.itinerary.map((item) => (
                  <div key={item.day} className="itinerary-item relative pb-lg">
                    <div className="itinerary-line" />
                    <div className="flex items-start">
                      <div className="relative z-10 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-[10px] font-bold">{item.day}</span>
                      </div>
                      <div className="flex-1 bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-headline-md text-body-lg font-bold">{item.title}</h4>
                          <span className="material-symbols-outlined text-outline-variant">{item.icon}</span>
                        </div>
                        <p className="text-on-surface-variant font-body-md">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="p-lg bg-primary-container text-on-primary-container rounded-xxl">
              <h3 className="font-headline-md text-headline-md mb-md">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {pkg.included.map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                    <span className="font-body-md">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Booking Card - 1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xxl p-lg shadow-[0px_20px_48px_rgba(0,0,0,0.06)] border border-outline-variant/20 space-y-lg">
              <div>
                <span className="font-label-md text-on-surface-variant">Starts from</span>
                <div className="flex items-baseline space-x-2">
                  <h3 className="font-display-lg text-[32px] text-primary">{pkg.price}</h3>
                  <span className="font-body-md text-on-surface-variant">/ per person</span>
                </div>
              </div>
              <div className="space-y-md">
                <div className="space-y-sm">
                  <label className="font-label-md text-on-surface block">Travel Date</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      calendar_today
                    </span>
                    <input
                      className="w-full h-[56px] pl-12 bg-surface-container-low border-none rounded-xl font-body-md focus:ring-2 focus:ring-primary cursor-pointer"
                      readOnly
                      type="text"
                      value={pkg.travelDate}
                    />
                  </div>
                </div>
                <div className="space-y-sm">
                  <label className="font-label-md text-on-surface block">Passengers</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      group
                    </span>
                    <select
                      className="w-full h-[56px] pl-12 bg-surface-container-low border-none rounded-xl font-body-md focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                      value={passengers}
                      onChange={(event) => setPassengers(event.target.value)}
                    >
                      {PASSENGER_OPTIONS.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-center font-body-md">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-bold">{pkg.priceBreakdown.subtotal}</span>
                </div>
                <div className="flex justify-between items-center font-body-md">
                  <span className="text-on-surface-variant">Taxes & Fees</span>
                  <span className="font-bold">{pkg.priceBreakdown.taxes}</span>
                </div>
                <div className="h-px bg-outline-variant/30" />
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-body-lg">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">{pkg.priceBreakdown.total}</span>
                </div>
              </div>
              <button
                className="w-full bg-secondary-container hover:bg-secondary text-white font-label-md text-label-md py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                type="button"
                onClick={handleSecureSpot}
              >
                Secure Your Spot
              </button>
              <p className="text-caption text-on-surface-variant text-center">
                No payment required for booking confirmation today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="bg-surface-container-low py-xxl">
          <Reveal className="max-w-container-max mx-auto px-gutter">
            <div className="flex justify-between items-end mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">You May Also Like</h2>
                <p className="font-body-md text-on-surface-variant mt-2">Curated luxury alternatives for your next adventure.</p>
              </div>
              <Link className="font-label-md text-primary flex items-center space-x-1 group" to="/packages">
                <span>View All Packages</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {relatedPackages.map((related) => (
                <PackageCard key={related.slug} to={`/packages/${related.slug}`} {...related} />
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </div>
  )
}
