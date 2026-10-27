import { keralaGallery } from '../../data/keralaPhotography'
import KeralaPhoto from './KeralaPhoto'

export default function KeralaGallery() {
  return <section className="site-container section-space" aria-labelledby="kerala-gallery-heading">
    <div className="section-heading"><div><p className="eyebrow">A sense of place</p><h2 className="section-title" id="kerala-gallery-heading">From the hills<br /><em>to the water.</em></h2></div><p className="section-intro heading-aside">Tea country, spice-scented forests, backwater canals and historic streets. A glimpse of the places along these journeys.</p></div>
    <div className="kerala-gallery">{keralaGallery.map(photoKey => <KeralaPhoto key={photoKey} photoKey={photoKey} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw" />)}</div>
  </section>
}
