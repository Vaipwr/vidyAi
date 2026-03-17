import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingStats } from "@/components/landing/stats"
import { LandingLanguages } from "@/components/landing/languages"
import { LandingTestimonials } from "@/components/landing/testimonials"
import { LandingCTA } from "@/components/landing/cta"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingLanguages />
        <LandingTestimonials />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
