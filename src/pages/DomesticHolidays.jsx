import { Link } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import ConsultationCTA from '../components/ui/ConsultationCTA'
import KeralaPhoto from '../components/ui/KeralaPhoto'

export default function DomesticHolidays() {
  return <>
    <PageMeta title="Domestic Holidays in India | Life & Leisure Travel" description="Discover personally planned domestic holidays. Begin with Kerala: tea country, spices and backwaters, across Base, Signature and Premium journeys." />
    <section className="site-container section-space domestic-intro"><p className="eyebrow">Domestic holidays</p><h1 className="section-title">Extraordinary journeys.<br /><em>Closer to home.</em></h1><p className="section-intro">Discover India with considered stays, local experiences and a personal approach to every detail. Kerala is the first destination in our domestic collection.</p><Link className="text-link" to="/packages">Explore International Holidays <span aria-hidden="true">↗</span></Link></section>
    <section className="site-container domestic-destination-section"><article className="domestic-destination"><KeralaPhoto photoKey="munnar-panorama" eager /><div><p className="eyebrow">Kerala · India</p><h2>Find your Kerala.</h2><p>From Munnar’s tea country to the quiet waterways of Kumarakom. Three ways to travel, with space to make the journey your own.</p><Link className="text-link" to="/domestic-holidays/kerala">Explore the Kerala collection <span aria-hidden="true">↗</span></Link></div></article></section>
    <ConsultationCTA />
  </>
}
