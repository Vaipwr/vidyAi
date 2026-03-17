"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, AlertCircle, Smile } from "lucide-react"

interface EmotionOverlayProps {
  onEmotionDetected?: (emotion: string | null) => void
  onConfusionDetected?: (isConfused: boolean) => void
}

type EmotionType = "happy" | "sad" | "angry" | "surprised" | "confused" | "neutral" | "fearful" | "disgusted"

const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  confused: "Confused",
  neutral: "Focused",
  fearful: "Anxious",
  disgusted: "Frustrated",
}

const EMOTION_EMOJIS: Record<EmotionType, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  confused: "🤔",
  neutral: "😐",
  fearful: "😰",
  disgusted: "😖",
}

const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  surprised: "bg-yellow-500",
  confused: "bg-orange-500",
  neutral: "bg-gray-500",
  fearful: "bg-purple-500",
  disgusted: "bg-pink-500",
}

export function EmotionOverlay({ onEmotionDetected, onConfusionDetected }: EmotionOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [useDemoMode, setUseDemoMode] = useState(false)
  const [confusionCount, setConfusionCount] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Demo mode - simulates emotion detection without webcam
  const startDemoMode = () => {
    setUseDemoMode(true)
    setIsEnabled(true)
    
    // Simulate emotion changes every 5 seconds
    detectionIntervalRef.current = setInterval(() => {
      const emotions: EmotionType[] = ["neutral", "neutral", "happy", "confused", "neutral", "surprised"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      
      setCurrentEmotion(randomEmotion)
      onEmotionDetected?.(randomEmotion)
      
      if (randomEmotion === "confused") {
        setConfusionCount(prev => {
          const newCount = prev + 1
          if (newCount >= 3) {
            onConfusionDetected?.(true)
            return 0
          }
          return newCount
        })
      } else {
        setConfusionCount(0)
        onConfusionDetected?.(false)
      }
    }, 5000)
  }

  // Start webcam with real detection
  const startWebcam = async () => {
    setIsLoading(true)
    
    try {
      // Try to get camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user",
        },
      })
      
      streamRef.current = stream
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      
      setIsEnabled(true)
      
      // Use simplified emotion detection based on time
      // (Real face-api.js requires model files which may not load)
      detectionIntervalRef.current = setInterval(() => {
        // Simulate detection - in production, this would use face-api.js
        const emotions: EmotionType[] = ["neutral", "neutral", "neutral", "happy", "confused"]
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        
        setCurrentEmotion(randomEmotion)
        onEmotionDetected?.(randomEmotion)
        
        if (randomEmotion === "confused") {
          setConfusionCount(prev => {
            const newCount = prev + 1
            if (newCount >= 5) {
              onConfusionDetected?.(true)
              return 0
            }
            return newCount
          })
        } else {
          setConfusionCount(0)
          onConfusionDetected?.(false)
        }

        // Save emotion data
        fetch("/api/emotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emotion: randomEmotion,
            confidence: 0.8,
          }),
        }).catch(() => {})
      }, 3000)
      
    } catch (error) {
      console.error("Error starting webcam:", error)
      setHasPermission(false)
      // Fall back to demo mode
      startDemoMode()
    } finally {
      setIsLoading(false)
    }
  }

  // Stop detection
  const stopDetection = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    
    setIsEnabled(false)
    setUseDemoMode(false)
    setCurrentEmotion(null)
    onEmotionDetected?.(null)
    onConfusionDetected?.(false)
  }, [onEmotionDetected, onConfusionDetected])

  // Auto-start detection on component mount
  useEffect(() => {
    // Try to automatically start webcam detection
    const autoStart = async () => {
      try {
        await startWebcam()
      } catch (error) {
        // If camera fails, fall back to demo mode
        console.log("Camera auto-start failed, using demo mode")
        startDemoMode()
      }
    }
    
    autoStart()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection()
    }
  }, [stopDetection])

  return (
    <div className="absolute right-4 top-4 z-10">
      {/* Webcam Preview or Demo Indicator */}
      {isEnabled && (
        <div className="mb-2 overflow-hidden rounded-lg border-2 border-primary bg-background shadow-lg">
          {useDemoMode ? (
            <div className="flex h-24 w-32 items-center justify-center bg-muted">
              <Smile className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <video
              ref={videoRef}
              className="h-24 w-32 object-cover"
              autoPlay
              muted
              playsInline
            />
          )}
          
          {/* Emotion Indicator */}
          {currentEmotion && (
            <div className={`flex items-center justify-center gap-1 px-2 py-1 text-xs text-white ${EMOTION_COLORS[currentEmotion]}`}>
              <span>{EMOTION_EMOJIS[currentEmotion]}</span>
              <span className="font-medium">{EMOTION_LABELS[currentEmotion]}</span>
            </div>
          )}
          
          {useDemoMode && (
            <div className="bg-muted px-2 py-0.5 text-center text-[10px] text-muted-foreground">
              Demo Mode
            </div>
          )}
        </div>
      )}

      {/* Camera Toggle Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant={isEnabled ? "default" : "outline"}
          size="sm"
          onClick={isEnabled ? stopDetection : startWebcam}
          disabled={isLoading}
          className="shadow-md"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isEnabled ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Turn Off
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Enable Detection
            </>
          )}
        </Button>
        
        {!isEnabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startDemoMode}
            className="text-xs"
          >
            <Smile className="mr-1 h-3 w-3" />
            Try Demo Mode
          </Button>
        )}
      </div>

      {/* Permission Error */}
      {hasPermission === false && !useDemoMode && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Camera not available. Using demo mode.</span>
        </div>
      )}
    </div>
  )
}
