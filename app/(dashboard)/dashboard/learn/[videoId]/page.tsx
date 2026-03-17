"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { VideoPlayer } from "@/components/video/video-player"
import { VideoSidebar } from "@/components/video/video-sidebar"
import { AiChatPanel } from "@/components/video/ai-chat-panel"
import { EmotionOverlay } from "@/components/video/emotion-overlay"
import { BookmarksPanel } from "@/components/video/bookmarks-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, List, X } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function VideoLearningPage() {
  const params = useParams()
  const videoId = params.videoId as string
  
  const { data: video, isLoading } = useSWR(`/api/videos/${videoId}`, fetcher)
  const [showChat, setShowChat] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null)
  const [isConfused, setIsConfused] = useState(false)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Video not found</h2>
          <p className="mt-2 text-muted-foreground">The video you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Main Video Area */}
      <div className="flex flex-1 flex-col">
        <div className="relative flex-1">
          <VideoPlayer
            videoId={video.youtubeId}
            onTimeUpdate={setCurrentTimestamp}
            isConfused={isConfused}
          />
          <EmotionOverlay
            onEmotionDetected={setCurrentEmotion}
            onConfusionDetected={setIsConfused}
          />
        </div>
        
        {/* Video Info */}
        <div className="border-t border-border bg-card p-4">
          <h1 className="text-xl font-bold text-foreground">{video.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
          
          {/* Mobile Controls */}
          <div className="mt-4 flex gap-2 lg:hidden">
            <Button
              variant={showSidebar ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowSidebar(!showSidebar)
                setShowChat(false)
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Playlist
            </Button>
            <Button
              variant={showChat ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowChat(!showChat)
                setShowSidebar(false)
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Help
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Video List & Bookmarks */}
      <div className={`${showSidebar ? "block" : "hidden"} w-full border-l border-border bg-card lg:block lg:w-96`}>
        <Tabs defaultValue="playlist" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="playlist" className="flex-1">Playlist</TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex-1">Bookmarks</TabsTrigger>
          </TabsList>
          <TabsContent value="playlist" className="flex-1 overflow-auto m-0">
            <VideoSidebar
              courseId={video.courseId}
              currentVideoId={videoId}
            />
          </TabsContent>
          <TabsContent value="bookmarks" className="flex-1 overflow-auto m-0 p-4">
            <BookmarksPanel
              videoId={videoId}
              currentTimestamp={currentTimestamp}
              currentEmotion={currentEmotion}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chat Panel */}
      <div className={`${showChat ? "block" : "hidden"} fixed inset-0 z-50 bg-background lg:relative lg:block lg:w-96`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <AiChatPanel
            videoId={videoId}
            videoTitle={video.title}
            currentTimestamp={currentTimestamp}
            currentEmotion={currentEmotion}
            isConfused={isConfused}
          />
        </div>
      </div>

      {/* Desktop Chat Toggle */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden"
        onClick={() => setShowChat(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}
