"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import type { Video, Course } from "@/lib/db"

interface ContinueLearningProps {
  videos: { video: Video; course: Course | undefined }[]
}

export function ContinueLearning({ videos }: ContinueLearningProps) {
  const { t } = useTranslation()
  const validVideos = videos.filter(v => v.course)

  if (validVideos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dash.continue.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t("dash.continue.start")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("dash.continue.browse")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/courses">{t("dash.continue.btn")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dash.continue.title")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/courses" className="gap-1">
            {t("dash.continue.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {validVideos.map(({ video, course }) => (
          <Link
            key={video.id}
            href={`/dashboard/learn/${video.id}`}
            className="group block"
          >
            <div className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
              {/* Thumbnail */}
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <Play className="h-5 w-5 translate-x-0.5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-primary">{course!.title}</p>
                  <h3 className="mt-1 truncate font-semibold text-foreground">
                    {video.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {video.duration}
                  </div>
                  <div className="flex-1">
                    <Progress value={0} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">0%</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
