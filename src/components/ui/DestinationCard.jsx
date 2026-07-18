import { Link } from 'react-router-dom'

// variant "portfolio": white card, fixed-height image, price footer (Home hero grid)
// variant "editorial": full-bleed image, gradient overlay, reveal-on-hover CTA (Destinations grid)
export default function DestinationCard({
  variant = 'portfolio',
  image,
  imageAlt,
  location,
  title,
  description,
  price,
  ctaLabel = 'View Packages',
  to,
}) {
  const content =
    variant === 'editorial' ? (
      <div className="group relative aspect-[3/4] overflow-hidden rounded-xxl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-500">
        <img
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={image}
          alt={imageAlt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-80" />
        <div className="absolute top-lg right-lg">
          <span className="glass-card px-md py-sm rounded-full font-label-md text-primary flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            {location}
          </span>
        </div>
        <div className="absolute bottom-0 w-full p-xl flex flex-col justify-end gap-md">
          <div className="glass-card p-lg rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-headline-md text-primary mb-xs">{title}</h3>
            <p className="font-body-md text-on-surface-variant line-clamp-2 mb-md">{description}</p>
            <button
              className="w-full bg-secondary text-white py-md rounded-lg font-label-md hover:bg-secondary-container transition-colors"
              type="button"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="group relative bg-white rounded-[24px] overflow-hidden editorial-shadow hover:-translate-y-2 transition-transform duration-500">
        <div className="relative h-[480px]">
          <img className="w-full h-full object-cover" src={image} alt={imageAlt} />
          <div className="absolute top-md left-md bg-white/90 backdrop-blur-md px-md py-xs rounded-full flex items-center space-x-1">
            <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
            <span className="font-label-md text-caption font-bold">{location}</span>
          </div>
        </div>
        <div className="p-lg">
          <h4 className="font-headline-md text-headline-md text-primary mb-xs">{title}</h4>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">{description}</p>
          <div className="flex justify-between items-center pt-md border-t border-outline-variant">
            <span className="font-label-md text-caption text-outline uppercase tracking-wider">Starts from</span>
            <span className="font-headline-md text-headline-md text-secondary">{price}</span>
          </div>
        </div>
      </div>
    )

  return to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    content
  )
}
