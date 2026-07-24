import { useState } from 'react'

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Contact form submitted:', form)
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xxl">
      <div className="max-w-2xl mx-auto text-center space-y-md mb-xl">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Get In Touch</span>
        <h1 className="font-display-lg text-headline-lg text-primary">Build a Custom Itinerary</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Tell us a little about the trip you have in mind, and one of our travel consultants will get back to you
          with a tailored proposal.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-xxl p-xl shadow-[0px_20px_48px_rgba(0,0,0,0.06)] border border-outline-variant/20">
        {submitted ? (
          <div className="text-center space-y-md py-lg">
            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
            <h2 className="font-headline-md text-headline-md text-primary">Thank you</h2>
            <p className="font-body-md text-on-surface-variant">
              We've received your message and will be in touch shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-block text-primary font-label-md hover:translate-x-1 transition-transform"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="space-y-md" onSubmit={handleSubmit}>
            <div className="space-y-sm">
              <label className="font-label-md text-on-surface block" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full h-[56px] px-4 bg-surface-container-low border-none rounded-xl font-body-md focus:ring-2 focus:ring-primary"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-sm">
              <label className="font-label-md text-on-surface block" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full h-[56px] px-4 bg-surface-container-low border-none rounded-xl font-body-md focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-sm">
              <label className="font-label-md text-on-surface block" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl font-body-md focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us about the trip you're dreaming of..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary-container hover:bg-secondary text-white font-label-md text-label-md py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
