import { createEnquiryContext } from '../lib/serviceEnquiry'
import { Link } from 'react-router-dom'
import HeroSection from '../components/ui/HeroSection'
import ServiceSelector from '../components/ui/ServiceSelector'
import TrustStrip from '../components/ui/TrustStrip'
import DiscoverIndia from '../components/ui/DiscoverIndia'
import ServiceCard from '../components/ui/ServiceCard'
import DestinationSection from '../components/ui/DestinationSection'
import DomesticHolidaysSection from '../components/ui/DomesticHolidaysSection'
import ConsultationCTA from '../components/ui/ConsultationCTA'
import PageMeta from '../components/seo/PageMeta'
import { packages } from '../data/packages'
import { unsplashImage } from '../lib/unsplash'

const FEATURED = ['maldives-signature-escape', 'discover-vietnam', 'bali-signature-escape']
const ESSENTIALS = [
  { icon: 'flight', title: 'Flights', description: 'One-way, return or a more ambitious route. Start with your dates and destinations.', to: '/?service=flights#service-selector' },
  { icon: 'hotel', title: 'Hotels', description: 'A city stay, a quiet retreat, or room for everyone. Tell us what matters to you.', to: '/?service=hotels#service-selector' },
  { icon: 'train', title: 'Trains', description: 'Help planning rail journeys, from station choices to your preferred travel class.', to: '/?service=trains#service-selector' },
  { icon: 'travel_explore', title: 'Visa Assistance', description: 'Understand the documentation process and prepare for the next step of your trip.', to: '/visa', label: 'Explore visa assistance' },
]

export default function Home() {
  return <div className="home-page">
    <PageMeta title="Life & Leisure Travel | Holidays & Personalised Travel Planning" description="Explore international holidays and India journeys with Life & Leisure Travel. Plan flights, hotels, trains and visa assistance with personalised travel support." />
    <HeroSection />
    <div className="site-container selector-wrap"><ServiceSelector /></div>
    <TrustStrip />

    <section className="site-container section-space" id="travel-essentials"><div className="section-heading"><div><p className="eyebrow">Every detail, considered</p><h2 className="section-title">Your travel essentials.<br /><em>One place to begin.</em></h2></div><p className="section-intro heading-aside">From the first flight to the final night away, bring your plans together with personal assistance.</p></div><div className="essentials-grid">{ESSENTIALS.map((service, index) => <ServiceCard key={service.title} number={`0${index + 1}`} {...service} />)}</div></section>

    <DestinationSection packages={FEATURED.map(slug => packages.find(pkg => pkg.slug === slug))} />
    <DomesticHolidaysSection />

    <DiscoverIndia />

    <section className="tailor-section" id="tailor-made"><div className="tailor-image"><img src={unsplashImage('1639458110591-17c4cede0c4b', { w: 1100 })} alt="Traditional lanterns glowing in warm colours in Hoi An, Vietnam" width="1100" height="1000" loading="lazy" /></div><div className="tailor-copy"><p className="eyebrow">Made around you</p><h2 className="section-title">A journey should feel<br /><em>like it belongs to you.</em></h2><p>Not everyone travels the same way. Start with the places you dream of, the things you love, and the pace that feels right.</p><p>Whether it's a celebration, a family escape or time away just for you, tell us what would make it meaningful.</p><Link className="button button-navy" to="/contact" state={{ enquiry: createEnquiryContext('tailor_made', {}, { sourcePath: '/#tailor-made' }) }}>Create My Journey <span aria-hidden="true">↗</span></Link></div></section>

    {/* Offers, testimonials and staff profiles are intentionally omitted until authentic, approved content is supplied. */}
    <section className="site-container section-space" id="about-us"><div className="about-heading"><p className="eyebrow">Why Life & Leisure</p><h2 className="section-title">More thought.<br /><em>More you.</em></h2><p className="section-intro">Life & Leisure brings holidays and everyday travel services together, with a personal conversation at the centre of the planning process.</p></div><div className="values-grid">{[['01', 'A personal starting point', 'Your interests, your budget, your reasons for travelling. A useful itinerary starts with listening.'], ['02', 'The details, connected', 'Consider flights, stays, transfers and documentation together, so each part fits the bigger picture.'], ['03', 'Clarity before commitment', 'Discuss options and confirm the details before booking. An enquiry is the beginning of a conversation.']].map(([number, title, body]) => <div key={number}><span className="eyebrow">{number}</span><h3>{title}</h3><p>{body}</p></div>)}</div></section>

    <section className="resources-section section-space" id="travel-resources"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">A little preparation goes a long way</p><h2 className="section-title">Travel with a clearer picture.</h2></div></div><div className="resources-grid"><Link to="/visa" className="resource-link"><span className="material-symbols-outlined" aria-hidden="true">description</span><h3>Visa & documentation</h3><p>Explore our assistance process and common questions. Requirements depend on your destination and passport.</p><span className="text-link">Read the visa guide ↗</span></Link><Link to="/destinations" className="resource-link"><span className="material-symbols-outlined" aria-hidden="true">public</span><h3>Find your next destination</h3><p>Explore places and possibilities before deciding where your next journey will take you.</p><span className="text-link">Discover destinations ↗</span></Link><div className="resource-faq"><h3>Before you begin</h3><details><summary>Can I personalise an existing holiday?</summary><p>Use a package as your starting point, then share your preferred dates, budget and changes in an enquiry.</p></details><details><summary>Is this an instant booking website?</summary><p>No. Travel is personally assisted. Quotes, availability and booking details must be confirmed separately.</p></details><details><summary>What should I include in an enquiry?</summary><p>Your destination, dates, traveller count, approximate budget and any important preferences are a helpful start.</p></details></div></div></div></section>
    <ConsultationCTA />
  </div>
}
