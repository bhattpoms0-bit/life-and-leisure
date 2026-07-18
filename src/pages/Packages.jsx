import PackageCard from '../components/ui/PackageCard'
import { packages } from '../data/packages'

export default function Packages() {
  return (
    <section className="max-w-container-max mx-auto px-gutter py-xxl">
      <div className="flex items-baseline justify-between mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Curated Packages</h2>
          <p className="font-body-md text-on-surface-variant mt-2">Handpicked luxury itineraries for the discerning traveler.</p>
        </div>
        <span className="font-body-md text-on-surface-variant">Showing {packages.length} packages</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {packages.map((pkg) => (
          <PackageCard key={pkg.slug} to={`/packages/${pkg.slug}`} {...pkg} />
        ))}
      </div>
    </section>
  )
}
