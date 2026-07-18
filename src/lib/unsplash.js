// Stable Unsplash CDN placeholders (images.unsplash.com), scene-matched per
// destination/hotel/package. Chosen deliberately per subject instead of the
// deprecated source.unsplash.com redirect service. Swap for real brand
// photography whenever it's available.
export function unsplashImage(photoId, { w = 1200, q = 80 } = {}) {
  return `https://images.unsplash.com/photo-${photoId}?q=${q}&w=${w}&auto=format&fit=crop`
}
