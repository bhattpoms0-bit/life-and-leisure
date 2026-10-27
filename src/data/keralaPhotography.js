// Photo selection is independent of the approved commercial package catalogue.
import credits from '../../public/images/kerala/editorial-photography-credits.json'

const descriptions = {
  'munnar-panorama': ['Light across the Munnar hills', 'Sunlit emerald tea plantations and layered green mountains in Munnar, Kerala.'],
  'munnar-mist': ['Munnar, softened by mist', 'Curving tea rows beneath dramatic mountain ridges and low mist in Munnar.'],
  'thekkady-mist': ['Thekkady in the morning mist', 'Forested hills and tropical foliage reflected in calm water beneath mist in Thekkady.'],
  'alleppey-cruise': ['A backwater moment in Alleppey', 'A traditional woven-roof houseboat travelling along a palm-lined Alleppey waterway.'],
  'kumarakom-reflections': ['Reflections in Kumarakom', 'A traditional houseboat and coconut palms reflected in still Kumarakom backwaters.'],
  'kochi-evening': ['Evening on the Kochi waterfront', 'Chinese fishing nets silhouetted in soft golden light on the Kochi waterfront.'],
  'kerala-dining': ['Kerala, at the table', 'A styled Kerala sadya on a banana leaf with rice, curries, papad and traditional desserts.'],
}
const positions = { 'munnar-mist': '50% 57%', 'kumarakom-reflections': '100% 50%', 'kochi-evening': '40% 50%' }
export const keralaPhotography = Object.fromEntries(credits.map(photo => [photo.key, {
  ...photo, caption: descriptions[photo.key][0], alt: descriptions[photo.key][1],
  src: `/images/kerala/${photo.files[0].file}`, width: photo.files[0].width, height: photo.files[0].height,
  small: `/images/kerala/${photo.files.at(-1).file}`,
  srcSet: photo.files.map(file => `/images/kerala/${file.file} ${file.width}w`).join(', '),
  position: positions[photo.key] ?? '50% 50%',
}]))

// This quiet-water photograph passes the review and is retained as an accent.
keralaPhotography['kumarakom-backwaters'] = {
  key: 'kumarakom-backwaters', caption: 'Quiet water in Kumarakom', alt: 'Palm leaves and reflections over the calm Kumarakom backwaters.',
  src: '/images/kerala/kumarakom-backwaters.jpg', small: '/images/kerala/kumarakom-backwaters-640.jpg', width: 1600, height: 1067,
  srcSet: '/images/kerala/kumarakom-backwaters-640.jpg 640w, /images/kerala/kumarakom-backwaters.jpg 1600w',
  author: 'Avin CP', source: 'https://unsplash.com/photos/green-palm-tree-near-body-of-water-during-daytime-fSG5K9bgCfM',
  licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license', position: '50% 50%',
}

export const packageHeroPhotography = { Base: 'munnar-panorama', Signature: 'munnar-mist', Premium: 'kumarakom-reflections' }
export const keralaGallery = ['thekkady-mist', 'kochi-evening', 'kerala-dining']
export const itineraryPhotography = {
  Base: { 2: 'munnar-mist', 3: 'thekkady-mist', 4: 'alleppey-cruise', 5: 'kochi-evening' },
  Signature: { 2: 'munnar-panorama', 3: 'thekkady-mist', 5: 'kochi-evening' },
  Premium: { 1: 'kochi-evening', 2: 'munnar-panorama', 4: 'thekkady-mist', 6: 'kumarakom-backwaters' },
}
export const photoNotes = {
  'thekkady-mist': 'Illustrative destination scenery. Activities follow your agreed itinerary.',
  'alleppey-cruise': 'Alleppey destination illustration. Any houseboat stay or upgrade is quoted separately.',
  'kumarakom-reflections': 'Kumarakom destination illustration; vessel and operator are confirmed in your final quotation.',
  'kerala-dining': 'A Kerala sadya illustration. Included dining venues and menus are specified in your final quotation.',
}
