import { unsplashImage } from '../lib/unsplash'

export const testimonials = [
  {
    name: 'Julian Sterling',
    role: 'Venture Capitalist',
    rating: 5,
    quote:
      "Life and Leisure didn't just book a trip; they curated an experience that will stay with our family forever. The attention to detail in the Maldives was simply beyond words. Their concierge handled a last-minute flight change with such grace it felt like magic.",
    avatar: unsplashImage('1624797432677-6f803a98acb3', { w: 200 }),
    avatarAlt: 'Portrait of a smiling man in a gray suit jacket.',
  },
  {
    name: 'Eleanor Vance',
    role: 'Interior Designer',
    rating: 5,
    quote:
      "The honeymoon they organized in Bali was a masterpiece. From the private flower-bath arrivals to the secluded dinner under the stars, every moment felt deeply personal and flawlessly executed. We wouldn't trust our travels to anyone else.",
    avatar: unsplashImage('1751799671223-3f561e0f5286', { w: 200 }),
    avatarAlt: 'Portrait of a smiling woman wearing sunglasses.',
  },
]
