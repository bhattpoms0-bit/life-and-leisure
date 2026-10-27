import { Link } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import DomesticPackageCard from '../components/ui/DomesticPackageCard'
import KeralaPhoto from '../components/ui/KeralaPhoto'
import KeralaGallery from '../components/ui/KeralaGallery'
import { keralaPackages, KERALA_PRICING_CONDITIONS } from '../data/domesticHolidays'

export default function KeralaCollection() {
  return <>
    <PageMeta title="Kerala Holidays — Base, Signature & Premium | Life & Leisure Travel" description="Explore three Kerala land-only holiday itineraries. Indicative pricing for at least four adults sharing twin/double rooms; all arrangements subject to final quotation." />
    <section className="site-container section-space kerala-hero"><div><Link className="text-link" to="/domestic-holidays">Domestic Holidays</Link><p className="eyebrow">The Kerala collection</p><h1 className="section-title">Tea country.<br />Quiet waters.<br /><em>Your kind of journey.</em></h1><p className="section-intro">Let Kerala unfold at your pace. Hills and spice gardens, heritage and backwaters, with three considered approaches to comfort and experience.</p><a className="button button-navy" href="#kerala-journeys">Find your journey <span aria-hidden="true">↓</span></a></div><KeralaPhoto photoKey="alleppey-cruise" eager sizes="(min-width: 1024px) 50vw, 100vw" /></section>
    <section className="site-container domestic-conditions" aria-labelledby="kerala-pricing-heading"><h2 id="kerala-pricing-heading">A personal quotation, before you commit.</h2><ul>{KERALA_PRICING_CONDITIONS.map(item => <li key={item}>{item}</li>)}</ul></section>
    <KeralaGallery />
    <section className="site-container section-space" id="kerala-journeys"><div className="section-heading"><div><p className="eyebrow">Three ways to experience Kerala</p><h2 className="section-title">Choose the journey<br />that feels like you.</h2></div></div><div className="domestic-package-grid">{keralaPackages.map(pkg => <DomesticPackageCard key={pkg.slug} pkg={pkg} />)}</div><p className="collection-note">Photographs illustrate the destinations, not confirmed hotels or included properties. Dates and suppliers are arranged through a personal quotation. No instant booking or payment is offered.</p></section>
  </>
}
