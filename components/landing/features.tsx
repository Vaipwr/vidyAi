"use client"

import { useTranslation } from "@/lib/i18n/LanguageContext"
import {
  Brain,
  Video,
  MessageSquare,
  BarChart3,
  Bookmark,
  Bell,
  Users,
  Award,
  Wifi
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Emotion-Aware Learning",
    description: "Our AI detects confusion through facial expressions and automatically pauses to offer help in your language.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Video,
    title: "AI Video Explanations",
    description: "Stuck on a concept? Get instant AI-generated explanations at any timestamp, powered by Google Gemini.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Share and upvote AI explanations. Learn from others who faced similar doubts on the same video.",
    color: "bg-success/20 text-success",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your emotional learning patterns, identify difficult topics, and optimize your study sessions.",
    color: "bg-warning/20 text-warning-foreground",
  },
  {
    icon: Bookmark,
    title: "Smart Bookmarking",
    description: "Auto-save confusion points. Resume exactly where you struggled with AI-recommended review sessions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bell,
    title: "Learning Nudges",
    description: "Personalized notifications with daily recaps and encouragement to maintain your learning streak.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Users,
    title: "Mentor Matching",
    description: "Connect with expert mentors who speak your language for personalized guidance and doubt clearing.",
    color: "bg-success/20 text-success",
  },
  {
    icon: Award,
    title: "Certificates & Badges",
    description: "Earn verifiable certificates upon course completion. Showcase your achievements to employers.",
    color: "bg-warning/20 text-warning-foreground",
  },
  {
    icon: Wifi,
    title: "Offline Support",
    description: "Download lessons for offline access. Perfect for areas with limited internet connectivity.",
    color: "bg-primary/10 text-primary",
  },
]

export function LandingFeatures() {
  const { t } = useTranslation()

  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {t("features.sub")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
