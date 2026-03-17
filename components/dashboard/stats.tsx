"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, Flame, Star } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

interface DashboardStatsProps {
  totalCourses: number
  completedVideos: number
  currentStreak: number
  totalPoints: number
}

const stats = [
  {
    labelKey: "dash.stats.enrolled",
    icon: BookOpen,
    color: "text-primary bg-primary/10",
  },
  {
    labelKey: "dash.stats.completed",
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
  {
    labelKey: "dash.stats.streak",
    icon: Flame,
    color: "text-warning bg-warning/10",
  },
  {
    labelKey: "dash.stats.points",
    icon: Star,
    color: "text-accent bg-accent/20",
  },
]

export function DashboardStats({ totalCourses, completedVideos, currentStreak, totalPoints }: DashboardStatsProps) {
  const { t } = useTranslation()
  const values = [totalCourses, completedVideos, currentStreak, totalPoints]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.labelKey}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{values[index]}</p>
              <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
