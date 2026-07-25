import { useEffect } from 'react'

// Sets the document title and meta description for the page it's rendered
// on, restoring the previous values on unmount. There's no per-route meta
// mechanism elsewhere in the app yet (index.html only has one static
// <title>/description for the whole SPA) — this is a small, dependency-free
// building block other pages can adopt the same way.
export default function PageMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title
    if (title) document.title = title

    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? null
    if (description && meta) {
      meta.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [title, description])

  return null
}
