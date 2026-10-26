import { genericEnquiryContext } from '../../lib/serviceEnquiry'
import { Link, useLocation } from 'react-router-dom'
import { unsplashImage } from '../../lib/unsplash'

const PHOTO = '1560703649-e3055f28bcf8'
export default function HeroSection() {
  const location = useLocation()
  return <section className="home-hero" aria-labelledby="hero-title">
    <img className="hero-photo" src={unsplashImage(PHOTO, { w: 1920 })} srcSet={`${unsplashImage(PHOTO, { w: 800 })} 800w, ${unsplashImage(PHOTO, { w: 1280 })} 1280w, ${unsplashImage(PHOTO, { w: 1920 })} 1920w`} sizes="100vw" alt="Whitewashed Santorini buildings and blue church domes overlooking the Aegean Sea at sunset" width="1920" height="1280" fetchPriority="high" />
    <div className="hero-shade" />
    <div className="site-container hero-content"><p className="eyebrow light-eyebrow">The world awaits. Travel your way.</p><h1 id="hero-title">Explore the World.<br /><em>We'll Handle the Details.</em></h1><p className="hero-subtitle">Flights, hotels, visas, train tickets and exceptional holidays — all supported by personalised travel expertise.</p><div className="button-row"><Link className="button button-ivory" to="/#service-selector">Plan Your Journey <span aria-hidden="true">↗</span></Link><Link className="button button-outline-light" to="/contact" state={{ enquiry: genericEnquiryContext(location, 'hero-travel-expert') }}>Speak to a Travel Expert</Link></div></div>
    <div className="hero-caption"><span className="caption-rule" /> A little inspiration from Santorini, Greece</div>
  </section>
}
