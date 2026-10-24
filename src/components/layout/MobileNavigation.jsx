import { Link } from 'react-router-dom'
import { navigation } from '../../data/navigation'

export default function MobileNavigation({ open, onNavigate }) {
  return <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" hidden={!open}><div className="site-container">
    {navigation.map(item => <Link key={item.label} to={item.to} onClick={onNavigate}>{item.label}<span aria-hidden="true">↗</span></Link>)}
    <Link className="button button-navy" to="/contact" onClick={onNavigate}>Plan My Trip</Link>
  </div></nav>
}
