import { Link } from 'react-router-dom'
import PackageCard from './PackageCard'
import { PRICING_DISCLAIMER } from '../../lib/packagePricing'

export default function DestinationSection({ packages }) {
  return <section className="section-space collection-section" id="international-holidays"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">Beyond the everyday</p><h2 className="section-title">Somewhere extraordinary.</h2><p className="section-intro">Popular international holidays, ready to make your own.</p></div><Link className="text-link" to="/packages">Explore all holidays <span aria-hidden="true">↗</span></Link></div><div className="home-package-grid">{packages.map(pkg => <PackageCard key={pkg.slug} {...pkg} variant="editorial" to={`/packages/${pkg.slug}`} />)}</div><p className="collection-note">{PRICING_DISCLAIMER}</p></div></section>
}
