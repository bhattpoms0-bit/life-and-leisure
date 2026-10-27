import KeralaPhoto from './KeralaPhoto'

export default function KeralaExperiences({ pkg }) {
  if (pkg.tier === 'Base') return null
  return <section className="domestic-content-section kerala-experiences" aria-labelledby="kerala-experience-heading">
    <p className="eyebrow">Considered experiences</p><h2 id="kerala-experience-heading">{pkg.tier === 'Signature' ? 'A little time, just for you.' : 'Space to slow down.'}</h2>
    <div className="kerala-wellness-feature"><span className="kerala-wellness-number" aria-hidden="true">{pkg.tier === 'Signature' ? '60' : '02'}</span><div><p className="eyebrow">{pkg.tier === 'Signature' ? 'Minutes of relaxation' : 'Curated wellness sessions'}</p><h3>{pkg.tier === 'Signature' ? 'Your included Ayurvedic relaxation massage' : 'Wellness, woven into your journey'}</h3><p>{pkg.tier === 'Signature' ? 'One prebooked 60-minute Ayurvedic relaxation massage per adult, subject to practitioner screening, guest consent and scheduling.' : 'Two curated Ayurvedic wellness sessions per consenting adult, subject to qualified-provider screening and availability.'}</p></div></div>
    <KeralaPhoto photoKey="kerala-dining" className="kerala-dining-photo" />
  </section>
}
