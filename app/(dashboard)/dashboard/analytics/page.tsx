"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmotionChart } from "@/components/analytics/emotion-chart"
import { EmotionTrendChart } from "@/components/analytics/emotion-trend-chart"
import { LearningProgressChart } from "@/components/analytics/learning-progress-chart"
import { WeeklyActivityChart } from "@/components/analytics/weekly-activity-chart"
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  Flame,
  BookOpen,
  Trophy
} from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const { data: stats, isLoading } = useSWR("/api/analytics/stats", fetcher)
  const { data: emotions } = useSWR("/api/emotions?days=30", fetcher)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t("dash.analytics.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("dash.analytics.desc")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("dash.analytics.watchTime")}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.totalWatchTime || 0}h
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <BookOpen className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("dash.analytics.completed")}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.coursesCompleted || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Flame className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("dash.analytics.streak")}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.currentStreak || 0} days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("dash.analytics.quizzes")}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.quizzesPassed || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="emotions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="emotions" className="gap-2">
            <Brain className="h-4 w-4" />
            {t("dash.analytics.tab.emotions")}
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            {t("dash.analytics.tab.progress")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Target className="h-4 w-4" />
            {t("dash.analytics.tab.activity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emotions">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("dash.analytics.card.emotion.title")}</CardTitle>
                <CardDescription>
                  {t("dash.analytics.card.emotion.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionChart data={emotions?.summary || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dash.analytics.card.trend.title")}</CardTitle>
                <CardDescription>
                  {t("dash.analytics.card.trend.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionTrendChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>{t("dash.analytics.card.prog.title")}</CardTitle>
              <CardDescription>
                {t("dash.analytics.card.prog.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LearningProgressChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>{t("dash.analytics.card.act.title")}</CardTitle>
              <CardDescription>
                {t("dash.analytics.card.act.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyActivityChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("dash.analytics.insights.title")}</CardTitle>
          <CardDescription>
            {t("dash.analytics.insights.desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mt-3 font-semibold text-foreground">{t("dash.analytics.ins1.title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dash.analytics.ins1.desc")}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <h4 className="mt-3 font-semibold text-foreground">{t("dash.analytics.ins2.title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dash.analytics.ins2.desc")}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <Target className="h-5 w-5 text-warning" />
              </div>
              <h4 className="mt-3 font-semibold text-foreground">{t("dash.analytics.ins3.title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dash.analytics.ins3.desc")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
