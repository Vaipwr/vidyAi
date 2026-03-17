"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Video, ArrowRight, Star, Users } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import type { Course } from "@/lib/db"

interface CourseGridProps {
  courses: Course[]
}

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-700",
  Intermediate: "bg-amber-500/10 text-amber-700",
  Advanced: "bg-red-500/10 text-red-700",
}

export function CourseGrid({ courses }: CourseGridProps) {
  const { t } = useTranslation()

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{t("courses.empty.title")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("courses.empty.desc")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="group overflow-hidden transition-all hover:shadow-lg">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <BookOpen className="h-12 w-12 text-primary/50" />
              </div>
            )}
            <Badge
              className={`absolute right-3 top-3 ${levelColors[course.level] || levelColors["Beginner"]}`}
            >
              {course.level}
            </Badge>
          </div>

          <CardContent className="p-5">
            {/* Category */}
            <Badge variant="secondary" className="mb-2 text-xs capitalize">
              {course.subject}
            </Badge>

            {/* Title */}
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
              {course.title}
            </h3>

            {/* Description */}
            {course.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            )}

            {/* Instructor */}
            <p className="mt-2 text-sm text-muted-foreground">
              {t("courses.stats.by")} <span className="font-medium text-foreground">{course.instructor}</span>
            </p>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                {course.videoCount} {t("courses.stats.videos")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
            </div>

            {/* Rating & Enrolled */}
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {course.enrolledCount.toLocaleString()} enrolled
              </div>
            </div>

            {/* CTA */}
            <Button asChild className="mt-4 w-full gap-2">
              <Link href={`/dashboard/learn/video-1`}>
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
