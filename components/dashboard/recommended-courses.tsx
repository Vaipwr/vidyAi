'use client'

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import type { Course } from "@/lib/db"

interface RecommendedCoursesProps {
  courses: Course[]
}

export function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("dash.rec.title")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/courses" className="gap-1">
            {t("dash.rec.all")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses`}
            className="group block"
          >
            <div className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 hover:bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <BookOpen className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {course.title}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {course.subject}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {course.videoCount} {t("dash.rec.videos")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
