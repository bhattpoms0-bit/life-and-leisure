import { useState } from 'react'
import StarRating from './StarRating'

export default function HotelCard({
  image,
  imageAlt,
  location,
  name,
  description,
  amenities = [],
  rating = 5,
  price,
  onViewAvailability,
}) {
  const [favorited, setFavorited] = useState(false)

  return (
    <div className="bg-white rounded-[24px] border border-outline-variant/30 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row h-auto md:h-[420px]">
      <div className="md:w-2/5 overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={image}
          alt={imageAlt}
        />
        <div className="absolute top-md left-md bg-white/90 backdrop-blur-md px-md py-xs rounded-full font-label-md text-primary text-caption">
          {location}
        </div>
      </div>
      <div className="flex-1 p-xl flex flex-col justify-between">
        <div className="space-y-md">
          <div className="flex justify-between items-start">
            <div className="space-y-xs">
              <StarRating rating={rating} size="sm" />
              <h2 className="font-headline-md text-headline-md text-primary">{name}</h2>
            </div>
            <button
              className={`material-symbols-outlined transition-colors ${favorited ? 'text-error' : 'text-outline hover:text-error'}`}
              type="button"
              aria-label="Toggle favorite"
              onClick={() => setFavorited((f) => !f)}
              style={{ fontVariationSettings: `'FILL' ${favorited ? 1 : 0}` }}
            >
              favorite
            </button>
          </div>
          <p className="text-on-surface-variant font-body-md line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-sm">
            {amenities.map((amenity) => (
              <span
                key={amenity.label}
                className="bg-surface-container-low px-md py-xs rounded-full font-label-md text-caption text-on-surface-variant flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">{amenity.icon}</span>
                {amenity.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-end border-t border-outline-variant/30 pt-lg">
          <div className="space-y-xs">
            <span className="font-caption text-on-surface-variant">Starting from</span>
            <div className="font-headline-md text-primary">
              {price} <span className="font-body-md text-on-surface-variant">/ night</span>
            </div>
          </div>
          <button
            className="bg-secondary text-white px-xl py-md rounded-lg font-label-md hover:bg-secondary-container transition-colors shadow-sm"
            type="button"
            onClick={onViewAvailability ?? (() => console.log(`View availability: ${name}`))}
          >
            View Availability
          </button>
        </div>
      </div>
    </div>
  )
}
