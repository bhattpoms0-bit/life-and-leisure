import credits from '../../public/images/india-around/photography-credits.json'
import { keralaPhotography } from './keralaPhotography'

// Editorial discovery only. Nepal and Bhutan remain international destinations;
// this collection does not change the package catalogue or promise availability.
const photos = Object.fromEntries(credits.map(photo => [photo.key, {
  ...photo,
  src: `/images/india-around/${photo.files[0].file}`,
  srcSet: photo.files.map(file => `/images/india-around/${file.file} ${file.width}w`).join(', '),
  width: photo.files[0].width, height: photo.files[0].height,
}]))

export const indiaAround = [
  { key: 'kerala', name: 'Kerala', subtitle: 'Tea Hills · Ayurveda · Backwaters', status: '3 Packages Available', to: '/domestic-holidays/kerala', country: 'India', photo: keralaPhotography['munnar-panorama'] },
  { key: 'goa', name: 'Goa', subtitle: 'Beaches · Coastal Escapes', country: 'India', alt: 'Palm trees and the sandy curve of Palolem Beach beside the Arabian Sea in Goa.' },
  { key: 'kashmir', name: 'Kashmir', subtitle: 'Lakes · Mountains · Valleys', country: 'India', alt: 'Traditional shikara boats reflected in Dal Lake with Srinagar and mountains beyond.' },
  { key: 'rajasthan', name: 'Rajasthan', subtitle: 'Palaces · Royal Heritage', country: 'India', alt: 'Lake Pichola, its island palace and Udaipur cityscape beneath softly lit hills at sunset.' },
  { key: 'seven-sisters', name: 'Seven Sisters', subtitle: 'Northeast India · Nature', country: 'India', alt: 'A living root bridge spanning a rocky stream beneath the rainforest canopy in Riwai, Meghalaya.' },
  { key: 'nepal', name: 'Nepal', subtitle: 'Himalayas · Culture', country: 'Nepal', alt: 'Traditional village houses and terraced hillsides along the Annapurna trail in Nepal.' },
  { key: 'bhutan', name: 'Bhutan', subtitle: 'Monasteries · Himalayan Culture', country: 'Bhutan', alt: 'Punakha Dzong beside the Mo Chhu river with green hills and traditional Bhutanese architecture.' },
  { key: 'himachal-pradesh', name: 'Himachal Pradesh', subtitle: 'Mountains · Valleys · Scenic Escapes', country: 'India', alt: 'Sunlit conifer forests and layered mountain slopes in the Manali region of Himachal Pradesh.' },
].map(destination => ({ status: 'Coming Soon', ...destination, photo: destination.photo ?? photos[destination.key] }))
