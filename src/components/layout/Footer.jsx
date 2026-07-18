import { useState } from 'react'
import { Link } from 'react-router-dom'

const linkClass = 'font-body-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-transform'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    console.log('Newsletter subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="bg-surface-container-high pt-xxl pb-xl border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="space-y-md">
          <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">
            Life and Leisure
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Defining the future of luxury travel through precision, passion, and unparalleled curation.
          </p>
          <div className="flex space-x-md">
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col space-y-sm">
          <h4 className="font-label-md text-label-md text-on-surface font-bold mb-md">Company</h4>
          <a className={linkClass} href="#">About Us</a>
          <a className={linkClass} href="#">Sustainability</a>
          <a className={linkClass} href="#">Careers</a>
          <a className={linkClass} href="#">Blog</a>
        </div>

        <div className="flex flex-col space-y-sm">
          <h4 className="font-label-md text-label-md text-on-surface font-bold mb-md">Support</h4>
          <a className={linkClass} href="#">Contact</a>
          <a className={linkClass} href="#">FAQ</a>
          <Link className={linkClass} to="/visa">Visa Guide</Link>
          <a className={linkClass} href="#">Terms of Service</a>
        </div>

        <div className="space-y-md">
          <h4 className="font-label-md text-label-md text-on-surface font-bold mb-md">Newsletter</h4>
          <p className="font-body-md text-on-surface-variant">
            Subscribe for exclusive travel insights and early access to new collections.
          </p>
          <form className="flex flex-col space-y-sm" onSubmit={handleSubscribe}>
            <input
              className="bg-white border-outline-variant rounded-xl px-md py-sm focus:ring-primary focus:border-primary"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="bg-primary text-white py-sm rounded-xl font-label-md hover:opacity-90 transition-opacity" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter mt-xxl pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
        <p className="font-label-md text-body-md text-on-surface-variant">
          © 2024 Life and Leisure. All rights reserved.
        </p>
        <div className="flex space-x-lg text-on-surface-variant">
          <a className="hover:text-primary" href="#">Privacy Policy</a>
          <a className="hover:text-primary" href="#">Terms</a>
          <a className="hover:text-primary" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}
