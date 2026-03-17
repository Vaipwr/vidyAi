"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, CloudOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { syncPendingChanges } from "@/lib/offline"
import { useToast } from "@/hooks/use-toast"

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online!",
        description: "Syncing your progress...",
      })
      // Auto-sync when coming back online
      handleSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Don't worry, your progress is saved locally.",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  const handleSync = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    try {
      await syncPendingChanges()
      toast({
        title: "Sync complete",
        description: "All your progress has been saved.",
      })
    } catch (error) {
      console.error("Sync failed:", error)
      toast({
        title: "Sync failed",
        description: "We'll try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  if (isOnline) {
    return null // Don't show anything when online
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border border-warning bg-warning/10 px-4 py-3 shadow-lg">
      <WifiOff className="h-5 w-5 text-warning" />
      <div>
        <p className="text-sm font-medium text-foreground">You're offline</p>
        <p className="text-xs text-muted-foreground">
          Progress is saved locally
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
