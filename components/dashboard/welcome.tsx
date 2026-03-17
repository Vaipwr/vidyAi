"use client"

import { format } from "date-fns"
import { useTranslation } from "@/lib/i18n/LanguageContext"

interface DashboardWelcomeProps {
  userName: string
}

export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  const { t } = useTranslation()

  const hour = new Date().getHours()
  let greetingKey = "dash.welcome.morning"
  if (hour >= 12 && hour < 17) greetingKey = "dash.welcome.afternoon"
  if (hour >= 17) greetingKey = "dash.welcome.evening"

  const firstName = userName.split(" ")[0]
  const today = format(new Date(), "EEEE, MMMM do")

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t(greetingKey)}, {firstName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {today} - {t("dash.welcome.ready")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-card px-4 py-2 shadow-sm">
            <p className="text-xs text-muted-foreground">{t("dash.welcome.goal")}</p>
            <p className="text-lg font-bold text-foreground">2/3 {t("dash.welcome.videos")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
