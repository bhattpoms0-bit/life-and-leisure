import { Link } from 'react-router-dom'
import { domesticEnquiryContext, domesticPackagePath } from '../../data/domesticHolidays'
import { keralaPhotography, packageHeroPhotography } from '../../data/keralaPhotography'
import { KeralaPhotoCredit } from './KeralaPhoto'

export default function DomesticPackageCard({ pkg }) {
  const photoKey = packageHeroPhotography[pkg.tier]
  const photo = keralaPhotography[photoKey]
  return <article className="domestic-card">
    <Link to={domesticPackagePath(pkg)} className="domestic-card-photo" aria-label={`View ${pkg.title}`}><img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 31vw, (min-width: 768px) 700px, 100vw" alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{ objectPosition: photo.position }} /><span>{pkg.days} days / {pkg.nights} nights</span></Link>
    <div className="domestic-card-credit"><KeralaPhotoCredit photoKey={photoKey} /></div>
    <div className="domestic-card-body"><p className="eyebrow">{pkg.tier}</p><h3><Link to={domesticPackagePath(pkg)}>{pkg.title}</Link></h3><p>{pkg.description}</p><p className="domestic-stay">{pkg.accommodation}</p>
      <ul>{pkg.highlights.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="domestic-card-price"><span>Indicative starting from</span><p><strong>{pkg.price}</strong> <span>per person</span></p><small>Land-only · minimum 4 adults · twin/double sharing</small></div>
      <p className="domestic-price-note">Provisional commercial target, subject to final quotation. Two-person and family pricing quoted separately.</p>
      <Link className="button button-navy" to={domesticPackagePath(pkg)}>View itinerary <span aria-hidden="true">↗</span></Link>
      <Link className="text-link" to="/contact" state={{ enquiry: domesticEnquiryContext(pkg, '/domestic-holidays/kerala') }}>Enquire about {pkg.tier}<span className="sr-only">: {pkg.title}</span></Link>
    </div>
  </article>
}
