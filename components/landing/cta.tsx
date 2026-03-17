import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

const benefits = [
  "Free access to all courses",
  "AI-powered explanations",
  "10+ Indian languages",
  "No credit card required",
]

export function LandingCTA() {
  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 text-center shadow-2xl sm:px-12 lg:px-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              Start Your Learning Journey Today
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
              Join over 50,000 students who are already learning smarter with AI. 
              No barriers, no boundaries, just education.
            </p>

            {/* Benefits List */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base font-semibold"
                asChild
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-base font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
