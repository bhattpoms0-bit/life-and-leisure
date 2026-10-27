import { Route, Routes } from 'react-router-dom'
import TopNav from './components/layout/TopNav'
import Footer from './components/layout/Footer'
import ScrollToLocation from './components/layout/ScrollToLocation'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import VietnamDestination from './pages/VietnamDestination'
import ThailandDestination from './pages/ThailandDestination'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Visa from './pages/Visa'
import Services from './pages/Services'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DomesticHolidays from './pages/DomesticHolidays'
import KeralaCollection from './pages/KeralaCollection'
import DomesticPackageDetail from './pages/DomesticPackageDetail'

export default function App() {
  return (
    <div className="bg-background text-on-surface font-body-md">
      <ScrollToLocation />
      <TopNav />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/vietnam" element={<VietnamDestination />} />
          <Route path="/destinations/thailand" element={<ThailandDestination />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/domestic-holidays" element={<DomesticHolidays />} />
          <Route path="/domestic-holidays/kerala" element={<KeralaCollection />} />
          <Route path="/domestic-holidays/kerala/:slug" element={<DomesticPackageDetail />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
