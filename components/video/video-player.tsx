"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Bookmark
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VideoPlayerProps {
  videoId: string
  onTimeUpdate?: (time: number) => void
  isConfused?: boolean
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId: string
          playerVars?: Record<string, number | string>
          events?: Record<string, (event: YouTubeEvent) => void>
        }
      ) => YouTubePlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YouTubePlayer {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  getVolume: () => number
  setVolume: (volume: number) => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  setPlaybackRate: (rate: number) => void
  getPlayerState: () => number
  destroy: () => void
}

interface YouTubeEvent {
  target: YouTubePlayer
  data?: number
}

export function VideoPlayer({ videoId, onTimeUpdate, isConfused }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isReady, setIsReady] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [mounted, setMounted] = useState(false)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pause video when user is confused
  useEffect(() => {
    if (isConfused && playerRef.current && isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    }
  }, [isConfused, isPlaying])

  // Load YouTube IFrame API
  useEffect(() => {
    if (!mounted) return

    const loadYouTubeAPI = () => {
      if (window.YT) {
        initializePlayer()
        return
      }

      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    }

    const initializePlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: YouTubeEvent) => {
            setIsReady(true)
            setDuration(event.target.getDuration())
            setVolume(event.target.getVolume())
          },
          onStateChange: (event: YouTubeEvent) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }

    loadYouTubeAPI()

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, mounted])

  // Update time
  useEffect(() => {
    if (!isReady) return

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime()
        setCurrentTime(time)
        onTimeUpdate?.(time)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady, onTimeUpdate])

  // Listen for seekTo events from bookmarks
  useEffect(() => {
    const handleSeekTo = (event: CustomEvent<number>) => {
      if (playerRef.current) {
        playerRef.current.seekTo(event.detail, true)
        setCurrentTime(event.detail)
      }
    }

    window.addEventListener("seekTo", handleSeekTo as EventListener)
    return () => window.removeEventListener("seekTo", handleSeekTo as EventListener)
  }, [])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

  const handleSeek = useCallback((value: number[]) => {
    if (!playerRef.current) return
    playerRef.current.seekTo(value[0], true)
    setCurrentTime(value[0])
  }, [])

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!playerRef.current) return
    playerRef.current.setVolume(value[0])
    setVolume(value[0])
    if (value[0] > 0 && isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }, [isMuted])

  const handleSkip = useCallback((seconds: number) => {
    if (!playerRef.current) return
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration))
    playerRef.current.seekTo(newTime, true)
    setCurrentTime(newTime)
  }, [currentTime, duration])

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!playerRef.current) return
    playerRef.current.setPlaybackRate(rate)
    setPlaybackRate(rate)
  }, [])

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  const handleBookmark = useCallback(async () => {
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          timestamp: currentTime,
          note: `Bookmarked at ${formatTime(currentTime)}`,
        }),
      })
    } catch (error) {
      console.error("Failed to save bookmark:", error)
    }
  }, [videoId, currentTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  if (!mounted) {
    return (
      <div className="relative aspect-video w-full bg-foreground/5">
        <div className="flex h-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full bg-foreground/5"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div id="youtube-player" className="h-full w-full" />

      {/* Confusion Alert Overlay */}
      {isConfused && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-2xl bg-card p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/20">
              <span className="text-3xl">🤔</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Need Help?</h3>
            <p className="mt-2 text-muted-foreground">
              It looks like you might be confused. Would you like me to explain this concept?
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={togglePlay}>
                Continue Watching
              </Button>
              <Button className="flex-1">
                Get AI Help
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={() => handleSkip(-10)}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={() => handleSkip(10)}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            {/* Volume */}
            <div className="ml-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            {/* Time */}
            <span className="ml-4 text-sm text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handleBookmark}
              title="Bookmark this moment"
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={playbackRate === rate ? "bg-accent" : ""}
                  >
                    {rate}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
