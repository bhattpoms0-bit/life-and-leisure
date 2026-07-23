import { Link } from 'react-router-dom'

// Single pricing-tier card used by TierComparisonSection. The "Most Popular"
// badge is rendered outside the card's own overflow-hidden wrapper (which
// clips the image to rounded corners) so it isn't cropped by that clip.
export default function TierCard({ tier }) {
  return (
    <div className="relative h-full">
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
              <span className="font-label-md text-caption text-outline uppercase tracking-wider">Per Person</span>
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
    </div>
  )
}
