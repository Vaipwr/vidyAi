"use client"

import { format } from "date-fns"

interface DashboardWelcomeProps {
  userName: string
}

export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  const hour = new Date().getHours()
  let greeting = "Good morning"
  if (hour >= 12 && hour < 17) greeting = "Good afternoon"
  if (hour >= 17) greeting = "Good evening"

  const firstName = userName.split(" ")[0]
  const today = format(new Date(), "EEEE, MMMM do")

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {firstName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {today} - Ready to continue learning?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-card px-4 py-2 shadow-sm">
            <p className="text-xs text-muted-foreground">Daily Goal</p>
            <p className="text-lg font-bold text-foreground">2/3 videos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
