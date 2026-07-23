import { useState } from 'react'
import DestinationCard from '../components/ui/DestinationCard'
import Reveal from '../components/ui/Reveal'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1761127138372-cad230082b19', { w: 1920 })

const REGIONS = ['All Regions', 'Southeast Asia', 'East Asia', 'Europe']

const TYPES = ['Luxury Escapes', 'Adventure', 'Wellness', 'Cultural Tours']

const SIGNATURE_DESTINATIONS = [
  {
    slug: 'thailand',
    location: 'Thailand',
    title: 'Bespoke Bangkok & Beyond',
    description: 'Discover curated luxury from the golden temples to private island retreats.',
    image: unsplashImage('1715158230572-f571ba4952da', { w: 900 }),
    imageAlt: 'A private infinity pool overlooking the ocean with lounge chairs and palm trees.',
    to: '/destinations/thailand',
  },
  {
    slug: 'vietnam',
    location: 'Vietnam',
    title: 'Heritage & Horizon',
    description: 'A journey through ancient Hoi An and the surreal beauty of Ninh Binh.',
    image: unsplashImage('1639458110591-17c4cede0c4b', { w: 900 }),
    imageAlt: 'A room filled with glowing traditional lanterns in Hoi An, Vietnam.',
    to: '/destinations/vietnam',
  },
  {
    slug: 'singapore',
    location: 'Singapore',
    title: 'Metropolitan Marvels',
    description: 'Experience the pinnacle of modern luxury and culinary excellence.',
    image: unsplashImage('1698513924628-4f6e0e4c00f6', { w: 900 }),
    imageAlt: "Singapore's illuminated Supertrees at Gardens by the Bay at night.",
  },
  {
    slug: 'japan',
    location: 'Japan',
    title: 'Timeless Kyoto',
    description: 'Immersion in the delicate balance of ancient rituals and modern refinement.',
    image: unsplashImage('1764445274404-f2e14fd3f20c', { w: 900 }),
    imageAlt: 'A traditional Japanese room with shoji screens and tatami mats.',
  },
  {
    slug: 'russia',
    location: 'Russia',
    title: 'Imperial Grandeur',
    description: "Private tours of St. Petersburg's palaces and the world's most opulent museums.",
    image: unsplashImage('1692190145571-cfac67889fc4', { w: 900 }),
    imageAlt: 'The Winter Palace in Saint Petersburg blanketed in snow.',
  },
  {
    slug: 'china',
    location: 'China',
    title: 'Celestial Wonders',
    description: 'From the futuristic skyline of Shanghai to the silent mountains of Guilin.',
    image: unsplashImage('1716929955955-f6ef9c1ca084', { w: 900 }),
    imageAlt: 'The Great Wall of China winding across mountainous terrain.',
  },
]

export default function Destinations() {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0])

  return (
    <div>
      {/* Editorial Hero Section */}
      <section className="relative h-[870px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative h-full max-w-container-max mx-auto px-gutter flex flex-col justify-end pb-xxl">
          <div className="max-w-2xl space-y-md">
            <span className="inline-block px-md py-xs bg-secondary/90 text-white rounded-full font-label-md tracking-widest uppercase">
              Special Feature
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
              The Allure of Southeast Asia
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-lg">
              Explore a world where ancient traditions meet modern luxury. From the emerald waters of Vietnam to the
              bustling streets of Singapore, discover the curated side of the Orient.
            </p>
            <div className="pt-md">
              <button
                className="group flex items-center gap-md text-white font-label-md"
                type="button"
                onClick={() => console.log('Explore the region clicked')}
              >
                <span className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
                EXPLORE THE REGION
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtering System */}
      <section className="bg-surface py-lg sticky top-20 z-40 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-gutter flex flex-wrap items-center justify-between gap-md">
          <div className="flex items-center gap-md min-w-0">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider shrink-0">Regions:</span>
            <div className="flex gap-sm overflow-x-auto">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`shrink-0 whitespace-nowrap px-lg py-sm rounded-full font-label-md transition-all ${
                    activeRegion === region
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-md">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Type:</span>
            <select className="bg-surface-container-high border-none rounded-full px-xl py-sm font-label-md focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
              {TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-container-max mx-auto px-gutter py-xxl">
        <Reveal className="flex items-baseline justify-between mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary">Signature Destinations</h2>
          <span className="font-body-md text-on-surface-variant">
            Showing {SIGNATURE_DESTINATIONS.length} exclusive locations
          </span>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {SIGNATURE_DESTINATIONS.map((destination) => (
            <DestinationCard
              key={destination.slug}
              variant="editorial"
              {...destination}
              to={destination.to || '/packages'}
            />
          ))}
        </div>
      </section>

      {/* Newsletter / Contact Teaser */}
      <section className="max-w-container-max mx-auto px-gutter pb-xxl">
        <Reveal className="relative bg-primary-container rounded-xxl p-xxl overflow-hidden text-center">
          <div className="relative z-10 space-y-md">
            <h2 className="font-headline-lg text-white">Can't decide on a destination?</h2>
            <p className="text-on-primary-container font-body-lg max-w-xl mx-auto">
              Our travel consultants specialize in crafting personalized itineraries that reflect your unique
              preferences and style.
            </p>
            <div className="flex justify-center gap-md pt-lg">
              <button
                className="bg-secondary text-white px-xxl py-md rounded-lg font-label-md hover:bg-secondary-container transition-all"
                type="button"
                onClick={() => console.log('Talk to an expert clicked')}
              >
                Talk to an Expert
              </button>
              <button
                className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-xxl py-md rounded-lg font-label-md hover:bg-white/20 transition-all"
                type="button"
                onClick={() => console.log('Browse all services clicked')}
              >
                Browse All Services
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
