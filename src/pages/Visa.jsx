import GlassSearchBar from '../components/ui/GlassSearchBar'
import Reveal from '../components/ui/Reveal'
import { unsplashImage } from '../lib/unsplash'

const HERO_IMAGE = unsplashImage('1760654343460-e38c0db08a71', { w: 1600 })
const DOCS_IMAGE = unsplashImage('1586441133374-ed1cb4007a47', { w: 900 })

const AVATARS = [
  { image: unsplashImage('1624797432677-6f803a98acb3', { w: 100 }), alt: 'Headshot of a travel consultant.' },
  { image: unsplashImage('1751799671223-3f561e0f5286', { w: 100 }), alt: 'Headshot of a travel consultant.' },
  { image: unsplashImage('1758518729286-e8d94cc231f5', { w: 100 }), alt: 'Headshot of a travel consultant wearing glasses.' },
]

const PROCESS_STEPS = [
  { icon: 'forum', title: '01. Consultation', description: 'Review your itinerary with our specialized regional experts.' },
  { icon: 'description', title: '02. Documents', description: 'Submit required documents through our secure, encrypted portal.' },
  { icon: 'cognition', title: '03. Submission', description: 'We manage all embassy appointments and filing procedures.' },
  { icon: 'verified', title: '04. Delivery', description: 'Receive your stamped passport via secure premium courier.' },
]

const FAQS = [
  {
    question: 'How long does the visa process usually take?',
    answer:
      'Processing times vary by destination and visa category. Typically, tourist visas take 10-15 working days. However, Life and Leisure offers priority concierge services for most major destinations that can expedite this to 3-5 days in certain cases.',
    defaultOpen: true,
  },
  {
    question: 'Do you guarantee visa approval?',
    answer:
      'While no service can guarantee approval as it is at the sole discretion of the respective embassy, our 98.7% success rate is built on meticulous document auditing. We flag potential issues before submission to minimize any chance of rejection.',
  },
  {
    question: 'Can I track my application status?',
    answer:
      'Yes. Every Life and Leisure client is assigned a dedicated visa specialist and gains access to our digital portal. You will receive real-time SMS and email updates at every stage—from document verification to embassy filing and final approval.',
  },
  {
    question: 'What happens if my visa is rejected?',
    answer:
      "In the rare event of a rejection, our specialists will review the embassy's feedback with you. We provide a complimentary re-evaluation and assistance with filing an appeal or a new application if the rejection reason can be mitigated.",
  },
]

export default function Visa() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[716px] flex items-center pt-xxl pb-xxl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
        </div>
        <div className="max-w-container-max mx-auto px-gutter relative z-20 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-caption mb-lg uppercase tracking-widest">
              Global Travel Solutions
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-lg text-primary">
              Simplify Your World Travel
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl leading-relaxed">
              Expert visa processing for over 150 destinations. We handle the complexity so you can focus on the journey.
            </p>
            <GlassSearchBar variant="compact" />
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="bg-white py-xxl">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xxl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Our Simplified Process</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Luxury service means a frictionless experience. From consultation to stamping, we guide every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg relative">
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-lg relative z-10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm text-primary">{step.title}</h3>
                <p className="text-on-surface-variant text-body-md px-md">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Required Documents Section (Bento Layout) */}
      <section className="py-xxl bg-surface-container-low">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-xxl gap-lg">
            <div className="max-w-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Essential Documentation</h2>
              <p className="text-on-surface-variant">
                Standard requirements for most international travel visas. Specific destination lists are provided during
                your initial consultation.
              </p>
            </div>
            <div className="flex gap-md">
              <button
                className="bg-surface-container-high p-3 rounded-full hover:bg-outline-variant transition-colors"
                type="button"
                onClick={() => console.log('Download requirements clicked')}
              >
                <span className="material-symbols-outlined">download</span>
              </button>
              <button
                className="bg-surface-container-high p-3 rounded-full hover:bg-outline-variant transition-colors"
                type="button"
                onClick={() => console.log('Print requirements clicked')}
              >
                <span className="material-symbols-outlined">print</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="glass-card p-xl rounded-3xl md:row-span-2 flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-primary mb-md">Passport Validity</h4>
                <p className="text-on-surface-variant mb-lg">
                  Original passport valid for at least 6 months beyond intended stay with at least two blank visa pages.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-lg mt-1">check_circle</span>
                    <span className="text-on-surface-variant">Clear copy of ID pages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-lg mt-1">check_circle</span>
                    <span className="text-on-surface-variant">Old passports (if applicable)</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="glass-card p-xl rounded-3xl group hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-lg mb-lg">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">photo_camera</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-primary">Photographs</h4>
              </div>
              <p className="text-on-surface-variant">
                Recent (within 6 months) color passport-sized photos with white background, adhering to specific embassy
                specs.
              </p>
            </div>
            <div className="glass-card p-xl rounded-3xl group hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-lg mb-lg">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-primary">Financial Proof</h4>
              </div>
              <p className="text-on-surface-variant">
                Last 3-6 months bank statements, income tax returns, or employment sponsorship letters.
              </p>
            </div>
            <div className="glass-card p-xl rounded-3xl md:col-span-2 group hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-xl items-center">
              <div className="md:w-1/3 w-full h-48 rounded-2xl overflow-hidden shadow-inner shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={DOCS_IMAGE}
                  alt="A passport and boarding pass arranged on a travel bag."
                />
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md text-primary mb-md">Itinerary & Accommodation</h4>
                <p className="text-on-surface-variant mb-xl">
                  Confirmed flight bookings and hotel reservation vouchers for the entire duration of stay in the
                  destination country.
                </p>
                <div className="flex gap-md flex-wrap">
                  <span className="px-4 py-2 bg-surface-container rounded-full text-caption font-label-md text-on-surface-variant">
                    FLIGHT BOOKINGS
                  </span>
                  <span className="px-4 py-2 bg-surface-container rounded-full text-caption font-label-md text-on-surface-variant">
                    HOTEL VOUCHERS
                  </span>
                  <span className="px-4 py-2 bg-surface-container rounded-full text-caption font-label-md text-on-surface-variant">
                    DAY-WISE ITINERARY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ Section */}
      <section className="py-xxl">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row gap-xxl">
            <div className="md:w-1/3">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Visa Questions?</h2>
              <p className="text-on-surface-variant mb-lg leading-relaxed">
                Our experts answer the most common queries regarding international visa processing and compliance.
              </p>
              <div className="p-lg bg-primary rounded-3xl text-on-primary">
                <span className="material-symbols-outlined text-4xl mb-md">support_agent</span>
                <h5 className="font-headline-md text-headline-md mb-xs">Need Direct Help?</h5>
                <p className="text-body-md opacity-80 mb-lg">Chat with our luxury travel concierge 24/7.</p>
                <button
                  className="w-full bg-white text-primary font-label-md py-4 rounded-xl hover:bg-opacity-90 transition-all"
                  type="button"
                  onClick={() => console.log('Start chat clicked')}
                >
                  Start Chat
                </button>
              </div>
            </div>
            <div className="md:w-2/3 space-y-md">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group glass-card rounded-2xl overflow-hidden" open={faq.defaultOpen}>
                  <summary className="flex justify-between items-center p-xl cursor-pointer list-none font-headline-md text-primary hover:bg-surface-container transition-colors">
                    <span>{faq.question}</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-xl pb-xl text-on-surface-variant leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA Section */}
      <section className="py-xxl">
        <Reveal className="max-w-container-max mx-auto px-gutter">
          <div className="relative rounded-[40px] overflow-hidden p-xxl text-center bg-gradient-to-br from-primary via-primary-container to-primary">
            <div className="relative z-20 max-w-2xl mx-auto">
              <h2 className="font-display-lg text-headline-lg text-white mb-lg">Your Journey Starts With a Conversation</h2>
              <p className="text-white/80 text-body-lg mb-xxl">
                Every destination has its unique nuances. Let our experts craft a bespoke visa strategy for your next
                international voyage.
              </p>
              <button
                className="bg-secondary-container text-on-secondary-container px-xxl py-5 rounded-2xl font-headline-md text-headline-md hover:scale-105 transition-transform duration-300 shadow-xl"
                type="button"
                onClick={() => console.log('Talk to a visa expert clicked')}
              >
                Talk to a Visa Expert
              </button>
              <div className="mt-xl flex items-center justify-center gap-xl">
                <div className="flex -space-x-3">
                  {AVATARS.map((avatar) => (
                    <div key={avatar.image} className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                      <img className="w-full h-full object-cover" src={avatar.image} alt={avatar.alt} />
                    </div>
                  ))}
                </div>
                <span className="text-white/60 font-label-md text-caption">Joined by 2,000+ travelers this month</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
