export default function TrustStrip() {
  return <div className="trust-strip site-container" aria-label="Our travel approach">{[['person', 'Personalised planning'], ['travel_explore', 'Full-service travel'], ['forum', 'Assisted booking'], ['route', 'Your journey, your pace']].map(([icon, text]) => <div key={text}><span className="material-symbols-outlined" aria-hidden="true">{icon}</span><span>{text}</span></div>)}</div>
}
