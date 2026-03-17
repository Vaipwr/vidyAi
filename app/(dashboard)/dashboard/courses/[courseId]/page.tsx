"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DownloadForOffline } from "@/components/offline/download-for-offline"
import {
  Play,
  Clock,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  ArrowLeft,
  Globe,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const { data: courses } = useSWR("/api/courses", fetcher)
  const { data: videos } = useSWR(`/api/courses/${courseId}/videos`, fetcher)

  const course = courses?.find((c: { id: string }) => c.id === courseId)

  if (!course) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Course not found</h2>
          <Link href="/dashboard/courses">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const completedVideos = 0
  const totalVideos = videos?.length || 0
  const progressPercent = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard/courses"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{course.subject}</Badge>
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {course.language}
            </Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>

          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="mt-3 text-muted-foreground">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{totalVideos} videos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{course.duration || "2h 30m"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{course.enrolledCount || "1.2k"} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span>{course.rating || "4.8"}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-medium">
                {completedVideos}/{totalVideos} completed
              </span>
            </div>
            <Progress value={progressPercent} className="mt-2 h-2" />
          </div>
        </div>

        {/* Action Card */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
              <Play className="h-12 w-12 text-primary" />
            </div>

            <div className="space-y-3">
              {videos && videos.length > 0 && (
                <Link href={`/dashboard/learn/${videos[0].id}`}>
                  <Button className="w-full" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    {completedVideos > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                </Link>
              )}

              <DownloadForOffline course={course} videos={videos || []} />
            </div>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Download for offline viewing in low-bandwidth areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Video List */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {videos?.map((video: { id: string; title: string; duration: string; order: number }, index: number) => {
              const isCompleted = false

              return (
                <Link
                  key={video.id}
                  href={`/dashboard/learn/${video.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{video.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                  </div>

                  <Play className="h-5 w-5 text-muted-foreground" />
                </Link>
              )
            })}

            {(!videos || videos.length === 0) && (
              <div className="py-8 text-center text-muted-foreground">
                No videos available for this course yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
