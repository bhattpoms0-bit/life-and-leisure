import { createEnquiryContext } from '../../lib/serviceEnquiry'
import { Link } from 'react-router-dom'
import { indiaJourneys } from '../../data/indiaJourneys'
import { indiaAround } from '../../data/indiaAround'

export default function DiscoverIndia() {
  return (
    <section className="site-container section-space india-section" id="discover-india">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Closer to home. A world to discover.</p>
          <h2 className="section-title" id="india-around-heading">India &amp; Around</h2>
        </div>
        <p className="section-intro heading-aside">From India's iconic landscapes to the hidden wonders of the Himalayas.</p>
      </div>
      <div className="india-around-grid" aria-labelledby="india-around-heading">
        {indiaAround.map(destination => {
          const { photo } = destination
          const content = <>
            <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 44vw, 88vw" width={photo.width} height={photo.height} alt={destination.alt ?? photo.alt} loading="lazy" decoding="async" />
            <div className="india-around-copy"><h3>{destination.name}</h3><p>{destination.subtitle}</p><span className={`india-around-status${destination.to ? ' is-available' : ''}`}>{destination.status}{destination.to && <span aria-hidden="true"> ↗</span>}</span></div>
          </>
          return <article className="india-around-card" key={destination.key}>
            {destination.to ? <Link className="india-around-destination" to={destination.to}>{content}</Link> : <div className="india-around-destination">{content}</div>}
            <small className="india-around-credit"><a href={photo.source} target="_blank" rel="noopener noreferrer">Photo: {photo.author}</a> · <a href={photo.licenceUrl} target="_blank" rel="noopener noreferrer">{photo.licence}</a> · Resized; display cropped.</small>
          </article>
        })}
      </div>
      <p className="india-around-note">One collection, across borders. Nepal and Bhutan are international destinations. More journeys are being prepared; only Kerala packages are currently available here.</p>
      <details className="india-experiences" id="india-experiences">
        <summary>Explore our bespoke India experiences <span aria-hidden="true">+</span></summary>
        <p className="section-intro">Begin with what moves you. These are ideas for a bespoke enquiry, with itineraries and availability arranged individually.</p>
      <div className="india-grid">
        {indiaJourneys.map(journey => (
          <Link
            key={journey.number}
            className="india-card"
            to="/contact"
            state={{ enquiry: createEnquiryContext('inbound_india', { destination: journey.location, experiences: journey.title }, { sourcePath: '/#discover-india', destination: journey.location, experience: journey.title }) }}
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
      </details>
    </section>
  )
}
