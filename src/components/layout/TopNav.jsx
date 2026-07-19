import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Destinations', to: '/destinations', match: (pathname) => ['/', '/destinations'].includes(pathname) },
  { label: 'Packages', to: '/packages', match: (pathname) => pathname.startsWith('/packages') },
  { label: 'Visa', to: '/visa', match: (pathname) => pathname === '/visa' },
  { label: 'Services', stub: true },
  { label: 'Blog', stub: true },
]

const activeClass = 'font-label-md text-label-md text-primary border-b-2 border-secondary font-bold pb-1'
const inactiveClass = 'font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors'
const mobileActiveClass = 'font-label-md text-label-md text-primary font-bold'
const mobileInactiveClass = 'font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors'

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        scrolled ? 'h-16' : 'h-20'
      }`}
    >
      <div className="max-w-container-max mx-auto px-gutter flex justify-between items-center h-full">
        <Link className="font-display-lg text-headline-md tracking-tighter text-primary" to="/">
          Life and Leisure
        </Link>

        <div className="hidden md:flex items-center space-x-xl">
          {NAV_LINKS.map((link) =>
            link.stub ? (
              <a key={link.label} className={inactiveClass} href="#">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.to} className={link.match(pathname) ? activeClass : inactiveClass}>
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center space-x-md">
          <button className="p-2 hover:opacity-80 transition-all" type="button" aria-label="Search">
            <span className="material-symbols-outlined text-primary">search</span>
          </button>
          <button className="p-2 hover:opacity-80 transition-all" type="button" aria-label="Account">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </button>
          <button
            className="hidden md:block bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:scale-95 transition-transform"
            type="button"
            onClick={() => console.log('Book Now clicked')}
          >
            Book Now
          </button>
          <button
            className="md:hidden p-2 hover:opacity-80 transition-all"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined text-primary">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border-t border-outline-variant/30">
          <div className="px-gutter py-lg flex flex-col space-y-md">
            {NAV_LINKS.map((link) =>
              link.stub ? (
                <a key={link.label} className={mobileInactiveClass} href="#" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={link.match(pathname) ? mobileActiveClass : mobileInactiveClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              className="w-full bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:scale-95 transition-transform"
              type="button"
              onClick={() => {
                console.log('Book Now clicked')
                setMenuOpen(false)
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
