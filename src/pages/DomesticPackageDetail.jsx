import { Link, useParams } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import KeralaPhoto from '../components/ui/KeralaPhoto'
import KeralaExperiences from '../components/ui/KeralaExperiences'
import { itineraryPhotography, packageHeroPhotography } from '../data/keralaPhotography'
import { domesticEnquiryContext, keralaPackages, KERALA_PRICING_CONDITIONS, KERALA_EXCLUSIONS } from '../data/domesticHolidays'

export default function DomesticPackageDetail() {
  const { slug } = useParams()
  const pkg = keralaPackages.find(item => item.slug === slug)
  if (!pkg) return <section className="site-container section-space"><h1 className="section-title">Package not found</h1><Link className="text-link" to="/domestic-holidays/kerala">Explore the Kerala collection</Link></section>
  const enquiry = domesticEnquiryContext(pkg)
  return <>
    <PageMeta title={`${pkg.title} | Life & Leisure Travel`} description={`${pkg.days} days / ${pkg.nights} nights in Kerala. ${pkg.tier} land-only itinerary with indicative pricing, subject to a personal quotation.`} />
    <section className="site-container section-space domestic-detail-heading"><nav aria-label="Breadcrumb"><Link to="/domestic-holidays">Domestic Holidays</Link><span aria-hidden="true"> / </span><Link to="/domestic-holidays/kerala">Kerala</Link></nav><p className="eyebrow">Kerala · {pkg.tier}</p><h1 className="section-title">{pkg.title}</h1><p className="section-intro">{pkg.description}</p><p className="domestic-duration">{pkg.days} Days / {pkg.nights} Nights · {pkg.route.join(' → ')}</p><KeralaPhoto photoKey={packageHeroPhotography[pkg.tier]} className={`kerala-detail-hero kerala-detail-hero-${pkg.tier.toLowerCase()}`} eager sizes="(min-width: 1400px) 1320px, 100vw" /><p className="domestic-price-note">Destination photography; accommodation and suppliers are confirmed only in your final quotation.</p></section>
    <div className="site-container domestic-detail-layout">
      <div><section className="domestic-content-section" aria-labelledby="itinerary-heading"><p className="eyebrow">The itinerary</p><h2 className="section-title" id="itinerary-heading">Your Kerala, day by day.</h2><ol className="domestic-itinerary">{pkg.itinerary.map(day => <li key={day.day}><span className="eyebrow">Day {day.day}</span><h3>{day.title}</h3><p>{day.body}</p>{itineraryPhotography[pkg.tier][day.day] && <KeralaPhoto photoKey={itineraryPhotography[pkg.tier][day.day]} className="kerala-itinerary-photo" />}{day.overnight && <p className="domestic-overnight">Overnight: {day.overnight}</p>}</li>)}</ol></section>
      <section className="domestic-content-section domestic-inclusions" aria-labelledby="included-heading"><h2 id="included-heading">What’s included</h2><p>{pkg.accommodation}. Properties and room categories are subject to availability and final quotation.</p><ul>{pkg.inclusions.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="domestic-content-section" aria-labelledby="excluded-heading"><h2 id="excluded-heading">What’s not included</h2><ul className="domestic-list">{KERALA_EXCLUSIONS.map(item => <li key={item}>{item}</li>)}</ul>{pkg.optional && <p>{pkg.optional}</p>}</section>
      <KeralaExperiences pkg={pkg} />
      {pkg.tier !== 'Base' && <section className="domestic-content-section domestic-wellness"><h2>Wellness, by choice.</h2><p>Participation is optional and requires guest consent and practitioner screening. Sessions depend on the qualified provider’s assessment and scheduling or availability. Any additional Ayurveda treatments are excluded. No medical outcome is promised.</p></section>}</div>
      <aside className="domestic-enquiry" aria-labelledby="quotation-heading"><p className="eyebrow">{pkg.tier} · {pkg.days} days / {pkg.nights} nights</p><h2 id="quotation-heading">Make this journey yours.</h2><p className="domestic-stay">{pkg.accommodation}</p><div className="domestic-card-price"><span>Indicative starting from</span><p><strong>{pkg.price}</strong> <span>per person</span></p></div><ul className="domestic-list">{KERALA_PRICING_CONDITIONS.map(item => <li key={item}>{item}</li>)}</ul><p>Departure dates and arrangements are tailored to your request. No fixed departure or hotel confirmation is implied.</p><Link className="button button-navy" to="/contact" state={{ enquiry }}>Enquire About This Trip <span aria-hidden="true">↗</span></Link><p className="domestic-price-note">An enquiry does not reserve travel or confirm a booking. No direct payment or instant booking.</p><Link className="text-link" to="/domestic-holidays/kerala">Compare all three Kerala journeys</Link></aside>
    </div>
  </>
}
