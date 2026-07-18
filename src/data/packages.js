import { unsplashImage } from '../lib/unsplash'

export const packages = [
  {
    slug: 'maldivian-overwater-serenity',
    title: 'Maldivian Overwater Serenity',
    description: 'Escape to a world of pure seclusion in your private overwater bungalow surrounded by turquoise lagoons.',
    duration: '10 Days',
    rating: 4.9,
    price: '$6,800',
    image: unsplashImage('1753939223042-872934ffda15', { w: 900 }),
    imageAlt: 'Overwater bungalows connected by wooden walkways over a turquoise Maldives lagoon.',
  },
  {
    slug: 'grecian-isles-grand-tour',
    title: 'Grecian Isles Grand Tour',
    description: 'A majestic odyssey through Athens, Mykonos, and Santorini with private yacht transfers and boutique hotels.',
    duration: '8 Days',
    rating: 4.8,
    price: '$5,400',
    image: unsplashImage('1560703649-e3055f28bcf8', { w: 900 }),
    imageAlt: 'Blue-domed churches and whitewashed architecture of Oia, Santorini at sunset.',
  },
  {
    slug: 'serengeti-luxury-safari',
    title: 'Serengeti Luxury Safari',
    description: 'Witness the Great Migration from the comfort of award-winning eco-lodges with private game drives.',
    duration: '12 Days',
    rating: 5.0,
    price: '$9,200',
    image: unsplashImage('1779216175784-a67b6da108bb', { w: 900 }),
    imageAlt: 'Spacious open-air luxury safari lodge with a thatched roof overlooking the savanna.',
  },
]
