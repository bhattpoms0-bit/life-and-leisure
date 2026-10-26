import { genericEnquiryContext } from '../../lib/serviceEnquiry'
import { Link, useLocation } from 'react-router-dom'

export default function ConsultationCTA() {
  const location = useLocation()
  return <section className="consultation-section section-space"><div className="site-container consultation-inner"><div><p className="eyebrow light-eyebrow">Let's begin with you</p><h2 className="section-title">The best journeys start<br />with a conversation.</h2><p>Share a place, a feeling, or simply a few days away.<br />Let's shape the details together.</p></div><Link className="button button-ivory" to="/contact" state={{ enquiry: genericEnquiryContext(location, 'consultation-plan-trip') }}>Plan My Trip <span aria-hidden="true">↗</span></Link></div></section>
}
