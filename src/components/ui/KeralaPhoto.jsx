import { keralaPhotography, photoNotes } from '../../data/keralaPhotography'

export function KeralaPhotoCredit({ photoKey }) {
  const photo = keralaPhotography[photoKey]
  return <small className="kerala-photo-credit"><a href={photo.source} target="_blank" rel="noopener noreferrer">Photo: {photo.author}</a> · <a href={photo.licenceUrl} target="_blank" rel="noopener noreferrer">{photo.licence}</a> · Cropped and resized.</small>
}

export default function KeralaPhoto({ photoKey, className = '', eager = false, sizes = '(min-width: 1024px) 45vw, 100vw', note }) {
  const photo = keralaPhotography[photoKey]
  return <figure className={`kerala-photo ${className}`}>
    <img src={photo.src} srcSet={photo.srcSet} sizes={sizes} width={photo.width} height={photo.height} loading={eager ? 'eager' : 'lazy'} decoding="async" alt={photo.alt} style={{ objectPosition: photo.position }} />
    <figcaption><span>{photo.caption}</span>{(note || photoNotes[photoKey]) && <span className="kerala-photo-note">{note || photoNotes[photoKey]}</span>}<KeralaPhotoCredit photoKey={photoKey} /></figcaption>
  </figure>
}
