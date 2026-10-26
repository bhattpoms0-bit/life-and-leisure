import { genericEnquiryContext } from '../../lib/serviceEnquiry'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../../data/navigation'
import MobileNavigation from './MobileNavigation'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const header = useRef(null)
  const location = useLocation()
  const { pathname, hash } = location
  useEffect(() => { setMenuOpen(false) }, [pathname, hash])
  useEffect(() => {
    const element = header.current
    if (!element) return undefined
    const updateHeight = () => {
      document.documentElement.style.setProperty('--site-header-height', `${Math.ceil(element.getBoundingClientRect().height)}px`)
    }
    updateHeight()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeight)
    observer?.observe(element)
    window.addEventListener('resize', updateHeight)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateHeight)
      document.documentElement.style.removeProperty('--site-header-height')
    }
  }, [])
  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOutside = event => {
      if (!header.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [menuOpen])
  const closeMenus = (event) => {
    if (event.key !== 'Escape') return
    const dropdown = event.target.closest('details')
    if (dropdown) { dropdown.open = false; dropdown.querySelector('summary').focus() }
    if (menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
  }
  return (
    <header ref={header} className="site-header" onKeyDown={closeMenus}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="header-note">Thoughtfully planned. Personally supported.</div>
      <div className="site-container header-inner">
        <Link to="/" aria-label="Life & Leisure Travel home" className="brand-logo"><img src="/logo.png" alt="Life & Leisure Travel" width="1015" height="813" /></Link>
        <nav aria-label="Main navigation" className="desktop-navigation">
          {navigation.map(item => item.children ? (
            <details className="nav-dropdown" key={item.label}>
              <summary>Travel Services <span aria-hidden="true">⌄</span></summary>
              <div className="nav-dropdown-panel">{item.children.map(child => <Link key={child.to} to={child.to} onClick={event => { event.currentTarget.closest('details').open = false }}>{child.label}</Link>)}</div>
            </details>
          ) : <Link key={item.label} to={item.to} state={item.to === '/contact' ? { enquiry: genericEnquiryContext(location, 'header-contact') } : undefined} aria-current={item.to === pathname && !hash ? 'page' : undefined}>{item.label}</Link>)}
        </nav>
        <Link className="button button-navy header-cta" to="/contact" state={{ enquiry: genericEnquiryContext(location, 'header-plan-trip') }}>Plan My Trip <span aria-hidden="true">↗</span></Link>
        <button ref={menuButton} type="button" className="menu-toggle" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(open => !open)}><span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span></button>
      </div>
      <MobileNavigation open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </header>
  )
}
