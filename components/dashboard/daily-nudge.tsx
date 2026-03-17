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
import { useTranslation } from "@/lib/i18n/LanguageContext"

interface NudgeSettings {
  enabled: boolean
  time: string
  frequency: "daily" | "weekdays" | "custom"
}

export function DailyNudge() {
  const { t } = useTranslation()
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
      ] as any,
    } as any)
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
          {t("dash.dn.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {permission === "denied" ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <BellOff className="h-5 w-5" />
              <p className="text-sm font-medium">{t("dash.dn.blocked.title")}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("dash.dn.blocked.desc")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nudge-enabled">{t("dash.dn.enable.label")}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("dash.dn.enable.desc")}
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
                      {t("dash.dn.time")}
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
                      {t("dash.dn.freq.label")}
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
                        <SelectItem value="daily">{t("dash.dn.freq.daily")}</SelectItem>
                        <SelectItem value="weekdays">{t("dash.dn.freq.weekdays")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <h4 className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t("dash.dn.receive.title")}
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>- {t("dash.dn.receive.1")}</li>
                    <li>- {t("dash.dn.receive.2")}</li>
                    <li>- {t("dash.dn.receive.3")}</li>
                    <li>- {t("dash.dn.receive.4")}</li>
                  </ul>
                </div>

                <Button variant="outline" size="sm" onClick={testNudge}>
                  {t("dash.dn.test")}
                </Button>
              </>
            )}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-4 h-auto p-0 text-xs">
              {t("dash.dn.dialog.trigger")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dash.dn.dialog.title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("dash.dn.dialog.desc")}
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">{t("dash.dn.feat1.title")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("dash.dn.feat1.desc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">{t("dash.dn.feat2.title")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("dash.dn.feat2.desc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">{t("dash.dn.feat3.title")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("dash.dn.feat3.desc")}
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
