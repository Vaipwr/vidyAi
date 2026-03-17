"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

const benefits = [
  "cta.ben.1",
  "cta.ben.2",
  "cta.ben.3",
  "cta.ben.4",
]

export function LandingCTA() {
  const { t } = useTranslation()

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
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
              {t("cta.sub")}
            </p>

            {/* Benefits List */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm font-medium">{t(benefit)}</span>
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
                  {t("cta.btn1")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-base font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/courses">{t("cta.btn2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
