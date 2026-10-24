import { Link } from 'react-router-dom'
import { indiaJourneys } from '../../data/indiaJourneys'

export default function DiscoverIndia() {
  return (
    <section className="site-container section-space india-section" id="discover-india">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Closer to home. A world to discover.</p>
          <h2 className="section-title">India, in your own way.</h2>
        </div>
        <p className="section-intro heading-aside">Begin with what moves you. These are ideas for a bespoke enquiry, with itineraries and availability arranged individually.</p>
      </div>
      <div className="india-grid">
        {indiaJourneys.map(journey => (
          <Link
            key={journey.number}
            className="india-card"
            to="/contact"
            state={{ enquiryDraft: `India journey enquiry\nInterest: ${journey.title}\n\nMy dates, travellers and preferences: ` }}
          >
            <figure className="india-photo">
              <img
                src={`/images/india/${journey.image}-960.jpg`}
                srcSet={`/images/india/${journey.image}-${journey.smallWidth ?? 480}.jpg ${journey.smallWidth ?? 480}w, /images/india/${journey.image}-960.jpg 960w`}
                sizes="(min-width: 1400px) 300px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, calc(100vw - 40px)"
                alt={journey.alt}
                width="960"
                height="720"
                loading="lazy"
                decoding="async"
                style={{ objectPosition: journey.position }}
              />
              <figcaption>{journey.location}</figcaption>
            </figure>
            <div className="india-card-copy">
              <div className="india-category"><p className="eyebrow">{journey.title}</p><span className="india-number" aria-hidden="true">{journey.number}</span></div>
              <h3>{journey.heading}</h3>
              <p>{journey.description}</p>
              <span className="text-link">Plan this journey <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
