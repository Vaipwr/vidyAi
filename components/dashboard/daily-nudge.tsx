"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Clock, Sparkles, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NudgeSettings {
  enabled: boolean
  time: string
  frequency: "daily" | "weekdays" | "custom"
}

export function DailyNudge() {
  const [settings, setSettings] = useState<NudgeSettings>({
    enabled: false,
    time: "09:00",
    frequency: "daily",
  })
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Load saved settings
    const saved = localStorage.getItem("nudgeSettings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    }
    return false
  }

  const enableNudges = async () => {
    const granted = permission === "granted" || (await requestPermission())
    if (granted) {
      const newSettings = { ...settings, enabled: true }
      setSettings(newSettings)
      localStorage.setItem("nudgeSettings", JSON.stringify(newSettings))
      scheduleNudge(newSettings)
    }
  }

  const disableNudges = () => {
    const newSettings = { ...settings, enabled: false }
    setSettings(newSettings)
    localStorage.setItem("nudgeSettings", JSON.stringify(newSettings))
  }

  const scheduleNudge = (s: NudgeSettings) => {
    // Calculate next nudge time
    const [hours, minutes] = s.time.split(":").map(Number)
    const now = new Date()
    const nudgeTime = new Date(now)
    nudgeTime.setHours(hours, minutes, 0, 0)

    if (nudgeTime <= now) {
      nudgeTime.setDate(nudgeTime.getDate() + 1)
    }

    const delay = nudgeTime.getTime() - now.getTime()

    // Schedule notification (this works only while the page is open)
    setTimeout(() => {
      if (s.enabled && permission === "granted") {
        sendNudge()
        // Reschedule for next day
        scheduleNudge(s)
      }
    }, delay)
  }

  const sendNudge = () => {
    // Get learning summary
    const completedToday = Math.floor(Math.random() * 3) + 1
    const streak = Math.floor(Math.random() * 10) + 1
    const nextVideo = "Introduction to Machine Learning"

    new Notification("VidyAI++ Learning Reminder", {
      body: `You have completed ${completedToday} videos today. Your streak is ${streak} days. Next up: "${nextVideo}"`,
      icon: "/favicon.ico",
      tag: "daily-nudge",
      requireInteraction: true,
      actions: [
        { action: "continue", title: "Continue Learning" },
        { action: "later", title: "Remind Later" },
      ] as NotificationAction[],
    })
  }

  const testNudge = () => {
    if (permission === "granted") {
      sendNudge()
    }
  }

  const updateSettings = (updates: Partial<NudgeSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    localStorage.setItem("nudgeSettings", JSON.stringify(newSettings))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-primary" />
          Daily Learning Nudges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {permission === "denied" ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <BellOff className="h-5 w-5" />
              <p className="text-sm font-medium">Notifications Blocked</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Please enable notifications in your browser settings to receive learning reminders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nudge-enabled">Enable Daily Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Get personalized learning recaps
                </p>
              </div>
              <Switch
                id="nudge-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  checked ? enableNudges() : disableNudges()
                }
              />
            </div>

            {settings.enabled && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="nudge-time" className="text-sm">
                      Reminder Time
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="time"
                        id="nudge-time"
                        value={settings.time}
                        onChange={(e) => updateSettings({ time: e.target.value })}
                        className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="nudge-frequency" className="text-sm">
                      Frequency
                    </Label>
                    <Select
                      value={settings.frequency}
                      onValueChange={(value) =>
                        updateSettings({ frequency: value as NudgeSettings["frequency"] })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <h4 className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    What you will receive:
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>- Daily learning progress summary</li>
                    <li>- Current streak motivation</li>
                    <li>- Next recommended video with offline download link</li>
                    <li>- Personalized tips based on your emotions</li>
                  </ul>
                </div>

                <Button variant="outline" size="sm" onClick={testNudge}>
                  Test Notification
                </Button>
              </>
            )}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-4 h-auto p-0 text-xs">
              Learn more about nudges
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Daily Learning Nudges</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Daily learning nudges help you stay consistent with your education journey, especially in low-bandwidth environments.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Personalized Recaps</h4>
                    <p className="text-xs text-muted-foreground">
                      Get a summary of what you learned yesterday and suggestions for today.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Offline Ready</h4>
                    <p className="text-xs text-muted-foreground">
                      Each nudge includes download links for your next videos, perfect for areas with unreliable internet.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Privacy First</h4>
                    <p className="text-xs text-muted-foreground">
                      All data stays on your device. We never share your learning patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
