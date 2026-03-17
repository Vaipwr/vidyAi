"use client"

import Link from "next/link"
import useSWR from "swr"
import { PlayCircle, CheckCircle, Clock, BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoSidebarProps {
  courseId: string
  currentVideoId: string
}

interface Video {
  id: string
  title: string
  duration: string
  order: number
  completed?: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function VideoSidebar({ courseId, currentVideoId }: VideoSidebarProps) {
  const { data: videos, isLoading } = useSWR<Video[]>(
    `/api/courses/${courseId}/videos`,
    fetcher
  )
  const { data: bookmarks } = useSWR<{ id: string; timestamp: number; note: string }[]>(
    `/api/bookmarks?videoId=${currentVideoId}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-16 w-28 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Course Videos</h3>
        <p className="text-sm text-muted-foreground">
          {videos?.length || 0} videos in this course
        </p>
      </div>

      {/* Video List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {videos?.map((video, index) => {
            const isCurrent = video.id === currentVideoId
            return (
              <Link
                key={video.id}
                href={`/dashboard/learn/${video.id}`}
                className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                  isCurrent
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                <div className="relative flex h-16 w-28 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  {video.completed && !isCurrent && (
                    <div className="absolute right-1 top-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-medium truncate ${
                      isCurrent ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {video.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bookmarks Section */}
      {bookmarks && bookmarks.length > 0 && (
        <div className="border-t border-border p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookmarkIcon className="h-4 w-4" />
            Your Bookmarks
          </h4>
          <div className="space-y-2">
            {bookmarks.slice(0, 5).map((bookmark) => (
              <Button
                key={bookmark.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  // Seek to bookmark timestamp
                  window.dispatchEvent(
                    new CustomEvent("seekTo", { detail: bookmark.timestamp })
                  )
                }}
              >
                <Clock className="mr-2 h-3 w-3" />
                {Math.floor(bookmark.timestamp / 60)}:
                {String(Math.floor(bookmark.timestamp % 60)).padStart(2, "0")}
                {bookmark.note && (
                  <span className="ml-2 truncate text-muted-foreground">
                    - {bookmark.note}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
