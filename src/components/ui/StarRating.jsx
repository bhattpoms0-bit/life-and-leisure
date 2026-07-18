const SIZE_CLASSES = {
  sm: 'scale-75 origin-left',
  md: '',
}

// variant "stars": a row of 5 filled/outlined stars (testimonials, hotel cards)
// variant "compact": a single filled star + numeric value (package cards, hero badges)
export default function StarRating({ rating = 5, size = 'md', reviewCount, variant = 'stars', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center text-secondary ${className}`}>
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
        <span className="font-label-md text-caption ml-1">
          {rating.toFixed(1)}
          {reviewCount ? ` (${reviewCount} Reviews)` : ''}
        </span>
      </div>
    )
  }

  const filled = Math.round(rating)

  return (
    <div className={`flex text-secondary-container ${SIZE_CLASSES[size]} ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'FILL' ${i < filled ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </div>
  )
}
