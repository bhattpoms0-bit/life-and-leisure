import { Link } from 'react-router-dom'
import StarRating from './StarRating'

export default function PackageCard({ image, imageAlt, duration, title, description, rating, price, to }) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-xxl overflow-hidden border border-outline-variant/20 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl group"
    >
      <div className="h-64 overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={imageAlt}
        />
        <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full text-primary text-caption font-bold">
          {duration}
        </div>
      </div>
      <div className="p-lg space-y-sm">
        <div className="flex justify-between items-start">
          <h4 className="font-headline-md text-body-lg text-primary leading-tight">{title}</h4>
          <StarRating rating={rating} variant="compact" />
        </div>
        <p className="text-on-surface-variant text-caption line-clamp-2">{description}</p>
        <div className="pt-4 flex justify-between items-center">
          <span className="font-headline-md text-body-lg text-primary">{price}</span>
          <span className="font-label-md text-on-surface-variant uppercase tracking-wider text-[10px]">Per person</span>
        </div>
      </div>
    </Link>
  )
}
