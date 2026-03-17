"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check, Loader2, Trash2 } from "lucide-react"
import { saveCourseOffline, saveVideoOffline, isContentOffline } from "@/lib/offline"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  subject: string
  language: string
}

interface Video {
  id: string
  title: string
  youtube_video_id: string
  duration: number
}

interface DownloadForOfflineProps {
  course: Course
  videos?: Video[]
}

export function DownloadForOffline({ course, videos = [] }: DownloadForOfflineProps) {
  const { toast } = useToast()
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Check if already downloaded
    isContentOffline(course.id, "course").then(setIsDownloaded)
  }, [course.id])

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Save course
      await saveCourseOffline({
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        subject: course.subject,
        language: course.language,
      })

      // Save videos
      for (const video of videos) {
        await saveVideoOffline({
          id: video.id,
          courseId: course.id,
          title: video.title,
          youtubeId: video.youtube_video_id,
          duration: video.duration,
        })
      }

      setIsDownloaded(true)
      toast({
        title: "Course saved offline!",
        description: `${course.title} is now available offline.`,
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (isDownloaded) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Check className="h-4 w-4 text-success" />
        Saved Offline
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      className="gap-2"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Save Offline
        </>
      )}
    </Button>
  )
}
