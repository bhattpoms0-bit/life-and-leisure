import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToLocation() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    // Wait for the routed page and measured sticky header before resolving a hash.
    const frame = requestAnimationFrame(() => {
      if (!hash) { window.scrollTo(0, 0); return }
      let id = hash.slice(1)
      try { id = decodeURIComponent(id) } catch { /* A malformed URL hash must not crash routing. */ }
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key])
  return null
}
