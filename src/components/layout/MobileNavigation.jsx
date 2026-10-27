import { genericEnquiryContext } from '../../lib/serviceEnquiry'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../../data/navigation'

export default function MobileNavigation({ open, onNavigate }) {
  const location = useLocation()
  return <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" hidden={!open}><div className="site-container">
    {navigation.map(item => <div key={item.label}><Link to={item.to} state={item.to === '/contact' ? { enquiry: genericEnquiryContext(location, 'mobile-contact') } : undefined} onClick={onNavigate}>{item.label}<span aria-hidden="true">↗</span></Link>{item.children?.map(child => <Link key={child.to} className="mobile-navigation-child" to={child.to} onClick={onNavigate}>{child.label}<span aria-hidden="true">↗</span></Link>)}</div>)}
    <Link className="button button-navy" to="/contact" state={{ enquiry: genericEnquiryContext(location, 'mobile-plan-trip') }} onClick={onNavigate}>Plan My Trip</Link>
  </div></nav>
}
