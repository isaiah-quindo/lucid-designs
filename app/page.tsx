import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Work from '@/components/Work'
import Pricing from '@/components/Pricing'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import SmoothScroll from '@/components/SmoothScroll'
import AvailabilityPill from '@/components/AvailabilityPill'

export default function HomePage() {
  return (
    <main className="relative">
      <SmoothScroll />
      <Cursor />
      <AvailabilityPill />
      <Nav />
      <Hero />
      <Services />
      <Work />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
