import { createEnquiryContext } from '../lib/serviceEnquiry.js'
import { unsplashImage } from '../lib/unsplash.js'

export const SERVICES = [
  {
    icon: 'edit_calendar',
    title: 'Bespoke Itinerary Planning',
    enquiryService: 'tailor_made',
    description: 'Fully custom trip design, tailored to your preferences, pace, and interests — no templates, no shortcuts.',
    image: unsplashImage('1504609773096-104ff2c73ba4', { w: 700 }),
    imageAlt: 'A flat-lay desk scene with map-patterned travel journals, a compass, and a pencil on a wooden table.',
  },
  {
    icon: 'support_agent',
    title: 'Personal Travel Support',
    enquiryService: 'travel_consultation',
    description: 'Discuss your travel questions and support requirements with our team.',
    image: unsplashImage('1766066014237-00645c74e9c6', { w: 700 }),
    imageAlt: 'A smiling concierge wearing a headset at her desk, ready to assist a traveler.',
  },
  {
    icon: 'description',
    title: 'Visa & Documentation Assistance',
    enquiryService: 'visa',
    description: 'Personal assistance with destination-specific visa requirements.',
    learnMoreTo: '/visa',
    image: unsplashImage('1586441133374-ed1cb4007a47', { w: 700 }),
    imageAlt: 'A passport and boarding pass arranged on a travel bag.',
  },
  {
    icon: 'airport_shuttle',
    title: 'Private Transfers & Chauffeur Services',
    enquiryService: 'travel_consultation',
    description: 'Seamless airport pickups, city transfers, and private drivers at every stop.',
    image: unsplashImage('1780296269675-169390638617', { w: 700 }),
    imageAlt: 'A polished black Mercedes-Benz S-Class sedan, ready for a private chauffeur transfer.',
  },
  {
    icon: 'hotel',
    title: 'Luxury Accommodation Curation',
    enquiryService: 'hotels',
    description: 'Hand-vetted hotels and villas, personally inspected for comfort and exclusivity.',
    image: unsplashImage('1544984243-ec57ea16fe25', { w: 700 }),
    imageAlt: 'A modern villa with a private pool overlooking the desert at a vivid pink-and-orange sunset.',
  },
  {
    icon: 'favorite',
    title: 'Honeymoon & Special Occasion Planning',
    enquiryService: 'tailor_made',
    description: 'Thoughtfully designed celebrations for anniversaries, proposals, and milestone moments.',
    image: unsplashImage('1603894309519-f4391826a2fd', { w: 700 }),
    imageAlt: 'A couple silhouetted against the sunset, embracing while standing in shallow water on a beach.',
  },
  {
    icon: 'business_center',
    title: 'Corporate & Group Travel',
    enquiryService: 'tailor_made',
    description: 'Incentive trips, offsites, and seamless coordination for multi-traveler journeys.',
    image: unsplashImage('1532968899863-5b52ef155913', { w: 700 }),
    imageAlt: 'A group of business travelers with rolling luggage walking through a sunlit airport terminal.',
  },
  {
    icon: 'alt_route',
    title: 'Multi-Destination Trip Design',
    enquiryService: 'tailor_made',
    description: 'Combine countries and regions into one seamlessly connected itinerary.',
    image: unsplashImage('1516738901171-8eb4fc13bd20', { w: 700 }),
    imageAlt: 'A world map with colorful pins marking multiple destinations across Southeast Asia.',
  },
  {
    icon: 'connecting_airports',
    title: 'Worldwide Air Ticketing',
    enquiryService: 'flights',
    description: 'Domestic and international flight booking across every major airline, handled end-to-end by our team.',
    image: unsplashImage('1745562313458-21fe14ef50a6', { w: 700 }),
    imageAlt: 'The sun setting over an airport tarmac and control tower, with an aircraft taxiing in the distance.',
  },
  {
    icon: 'flight',
    title: 'Domestic Ticketing',
    enquiryService: 'flights',
    description: 'Fast, reliable domestic flight bookings across India, with fare tracking and schedule support.',
    image: unsplashImage('1756535789308-8523b9ee209d', { w: 700 }),
    imageAlt: 'View of an airplane wing above the clouds during a warm orange sunset.',
  },
]

export const serviceCardEnquiry = service => createEnquiryContext(service.enquiryService, {}, { sourcePath: '/services', experience: service.title })

