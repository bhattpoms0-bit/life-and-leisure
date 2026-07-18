import { useEffect, useRef, useState } from 'react'

// Ports the mockups' IntersectionObserver fade/slide-up reveal (see
// PAGE_INVENTORY.md) to a per-element React hook instead of a global
// `document.querySelectorAll('section > div')` pass.
export default function useRevealOnScroll() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}
