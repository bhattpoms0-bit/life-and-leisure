import { Route, Routes } from 'react-router-dom'
import TopNav from './components/layout/TopNav'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import VietnamDestination from './pages/VietnamDestination'
import ThailandDestination from './pages/ThailandDestination'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Visa from './pages/Visa'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <TopNav />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/vietnam" element={<VietnamDestination />} />
          <Route path="/destinations/thailand" element={<ThailandDestination />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
