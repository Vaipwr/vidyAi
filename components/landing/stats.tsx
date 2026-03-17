"use client"

import { Users, BookOpen, Globe, Award } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

const stats = [
  {
    icon: Users,
    value: "50,000+",
    labelKey: "stats.students.label",
    descKey: "stats.students.desc",
  },
  {
    icon: BookOpen,
    value: "500+",
    labelKey: "stats.videos.label",
    descKey: "stats.videos.desc",
  },
  {
    icon: Globe,
    value: "10+",
    labelKey: "stats.langs.label",
    descKey: "stats.langs.desc",
  },
  {
    icon: Award,
    value: "95%",
    labelKey: "stats.success.label",
    descKey: "stats.success.desc",
  },
]

export function LandingStats() {
  const { t } = useTranslation()

  return (
    <section className="border-y border-border bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{t(stat.labelKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(stat.descKey)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
