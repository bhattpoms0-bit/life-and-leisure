import { Link } from 'react-router-dom'
import { businessDetails } from '../../data/businessDetails'

const groups = [
  { title: 'Find your journey', links: [['International holidays', '/packages'], ['Explore destinations', '/destinations'], ['Discover India', '/#discover-india'], ['Tailor-made travel', '/#tailor-made']] },
  { title: 'Travel, taken care of', links: [['Travel services', '/services'], ['Flight, hotel & train enquiries', '/#service-selector'], ['Visa assistance', '/visa'], ['Travel resources', '/#travel-resources']] },
  { title: 'Life & Leisure', links: [['Our approach', '/#about-us'], ['Plan your trip', '/contact'], ['Contact us', '/contact']] },
]
export default function Footer() {
  return <footer className="site-footer">
    <div className="site-container footer-grid">
      <div className="footer-brand"><Link to="/" aria-label="Life & Leisure Travel home"><img src="/logo.png" alt="Life & Leisure Travel" width="1015" height="813" loading="lazy" /></Link><p>Extraordinary places.<br />A more personal way to travel.</p><p className="footer-small">Holidays, flights, hotels, trains and visa assistance. Start with a conversation.</p><p className="footer-small">Operated by {businessDetails.legalName}.</p></div>
      {groups.map(group => <div key={group.title}><h2>{group.title}</h2><ul>{group.links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>{group.title === 'Life & Leisure' && <Link className="button button-navy footer-cta" to="/contact">Plan My Trip <span aria-hidden="true">↗</span></Link>}</div>)}
    </div>
    {(businessDetails.email || businessDetails.phone || businessDetails.address || businessDetails.supportHours) && <div className="site-container footer-business"><h2>Contact & support</h2><dl>
      {businessDetails.email && <div><dt>Email</dt><dd><a href={`mailto:${businessDetails.email}`}>{businessDetails.email}</a></dd></div>}
      {businessDetails.phone && <div><dt>Phone</dt><dd><a href={`tel:${businessDetails.phone.replace(/[^+\d]/g, '')}`}>{businessDetails.phone}</a></dd></div>}
      {businessDetails.address && <div><dt>Office</dt><dd>{businessDetails.address}</dd></div>}
      {businessDetails.supportHours && <div><dt>Support hours</dt><dd>{businessDetails.supportHours}</dd></div>}
    </dl></div>}
    {businessDetails.trustInformation.length > 0 && <ul className="site-container footer-trust">{businessDetails.trustInformation.map(detail => <li key={detail}>{detail}</li>)}</ul>}
    <div className="site-container footer-bottom"><p>© {new Date().getFullYear()} Life & Leisure Travel.</p>{businessDetails.policies.length > 0 ? <nav aria-label="Policies">{businessDetails.policies.map(policy => <Link key={policy.to} to={policy.to}>{policy.label}</Link>)}</nav> : <span>Designed around the way you travel.</span>}</div>
  </footer>
}
