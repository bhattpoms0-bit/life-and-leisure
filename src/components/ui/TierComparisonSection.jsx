import Reveal from './Reveal'
import TierCard from './TierCard'

export default function TierComparisonSection({ eyebrow = 'Choose Your Journey', heading, tiers }) {
  return (
    <section className="max-w-container-max mx-auto px-gutter py-xxl">
      <Reveal className="text-center mb-xl max-w-2xl mx-auto">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">{eyebrow}</span>
        <h2 className="font-display-lg text-headline-lg text-primary mt-xs">{heading}</h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
        {tiers.map((tier) => (
          <Reveal key={tier.key}>
            <TierCard tier={tier} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
