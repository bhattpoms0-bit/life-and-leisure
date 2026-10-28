import credits from '../../public/images/india-around/photography-credits.json'
import { keralaPhotography } from './keralaPhotography'

// Editorial discovery only. Nepal remains an international destination;
// this collection does not change the package catalogue or promise availability.
const photos = Object.fromEntries(credits.map(photo => [photo.key, {
  ...photo,
  src: `/images/india-around/${photo.files[0].file}`,
  srcSet: photo.files.map(file => `/images/india-around/${file.file} ${file.width}w`).join(', '),
  width: photo.files[0].width, height: photo.files[0].height,
}]))

export const indiaAround = [
  { key: 'seven-sisters', name: 'Northeast India', subtitle: 'Living Root Bridges · Nature', country: 'India', alt: 'A living root bridge spanning a rocky stream beneath the rainforest canopy in Riwai, Meghalaya.' },
  { key: 'goa', name: 'Goa', subtitle: 'Beaches · Coastal Escapes', country: 'India', alt: 'Palm trees and the sandy curve of Palolem Beach beside the Arabian Sea in Goa.' },
  { key: 'kerala', name: 'Kerala', subtitle: 'Tea Hills · Ayurveda · Backwaters', status: '3 Packages Available', to: '/domestic-holidays/kerala', country: 'India', photo: keralaPhotography['munnar-panorama'] },
  { key: 'nepal', name: 'Nepal', subtitle: 'Himalayas · Culture', country: 'Nepal', alt: 'Traditional village houses and terraced hillsides along the Annapurna trail in Nepal.' },
].map(destination => ({ status: 'Coming Soon', ...destination, photo: destination.photo ?? photos[destination.key] }))
