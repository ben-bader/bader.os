import SiteHeader from './SiteHeader'
import ConstellationNav from './ConstellationNav'
import HeroSection from './sections/HeroSection'
import FeaturedWorkSection from './sections/FeaturedWorkSection'
import AboutSection from './sections/AboutSection'
import CapabilitiesSection from './sections/CapabilitiesSection'
import JourneySection from './sections/JourneySection'
import ContactSection from './sections/ContactSection'
import PortfolioFooter from './sections/PortfolioFooter'

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader />
      <ConstellationNav />
      <main id="main-content">
        <HeroSection />
        <FeaturedWorkSection />
        <AboutSection />
        <CapabilitiesSection />
        <JourneySection />
        <ContactSection />
      </main>
      <PortfolioFooter />
    </>
  )
}
