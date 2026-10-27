import { Link } from 'react-router-dom'
import KeralaPhoto from './KeralaPhoto'

export default function DomesticHolidaysSection() {
  return <section className="site-container section-space domestic-home" aria-labelledby="domestic-home-heading"><div><p className="eyebrow">Domestic holidays · introducing Kerala</p><h2 className="section-title" id="domestic-home-heading">A little closer.<br /><em>Just as extraordinary.</em></h2><p className="section-intro">Tea-country mornings, spice-scented hills and unhurried backwaters. Discover our Base, Signature and Premium Kerala journeys.</p><Link className="button button-navy" to="/domestic-holidays">Explore Domestic Holidays <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/domestic-holidays/kerala">Discover the Kerala collection</Link></div><KeralaPhoto photoKey="munnar-panorama" /></section>
}
