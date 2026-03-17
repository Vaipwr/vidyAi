"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookmarkIcon, 
  Clock, 
  Trash2, 
  Plus,
  AlertCircle,
  Smile,
  Frown
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Bookmark {
  id: string
  videoId: string
  timestamp: number
  note: string
  emotionState?: string
  createdAt: string
}

interface BookmarksPanelProps {
  videoId: string
  currentTimestamp: number
  currentEmotion: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BookmarksPanel({ 
  videoId, 
  currentTimestamp, 
  currentEmotion 
}: BookmarksPanelProps) {
  const [note, setNote] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { data: bookmarks, isLoading } = useSWR<Bookmark[]>(
    `/api/bookmarks?videoId=${videoId}`,
    fetcher
  )

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAddBookmark = async () => {
    setIsAdding(true)
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          timestamp: currentTimestamp,
          note: note || `Bookmark at ${formatTime(currentTimestamp)}`,
          emotionState: currentEmotion,
        }),
      })
      mutate(`/api/bookmarks?videoId=${videoId}`)
      setNote("")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add bookmark:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" })
      mutate(`/api/bookmarks?videoId=${videoId}`)
    } catch (error) {
      console.error("Failed to delete bookmark:", error)
    }
  }

  const handleSeekTo = (timestamp: number) => {
    window.dispatchEvent(new CustomEvent("seekTo", { detail: timestamp }))
  }

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case "confused":
        return <AlertCircle className="h-3 w-3 text-amber-500" />
      case "happy":
        return <Smile className="h-3 w-3 text-green-500" />
      case "frustrated":
        return <Frown className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <BookmarkIcon className="h-5 w-5 text-primary" />
          Progress Bookmarks
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bookmark</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  Current time: <strong>{formatTime(currentTimestamp)}</strong>
                </p>
                {currentEmotion && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    Emotion detected: {getEmotionIcon(currentEmotion)}
                    <span className="capitalize">{currentEmotion}</span>
                  </p>
                )}
              </div>
              <Input
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddBookmark}
                  disabled={isAdding}
                >
                  {isAdding ? "Saving..." : "Save Bookmark"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/50"
            >
              <button
                className="flex flex-1 items-center gap-3 text-left"
                onClick={() => handleSeekTo(bookmark.timestamp)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatTime(bookmark.timestamp)}
                    {bookmark.emotionState && (
                      <span className="ml-2">
                        {getEmotionIcon(bookmark.emotionState)}
                      </span>
                    )}
                  </p>
                  {bookmark.note && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {bookmark.note}
                    </p>
                  )}
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteBookmark(bookmark.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <BookmarkIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No bookmarks yet. Click the bookmark button while watching to save your progress.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Click on any bookmark to resume from that point. Bookmarks with confusion markers help you review difficult concepts.
      </p>
    </div>
  )
}
