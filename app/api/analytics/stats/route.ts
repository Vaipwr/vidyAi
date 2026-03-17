import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = db.getDefaultUser()
    const emotionStats = db.getEmotionStats(user.id)
    const bookmarks = db.getBookmarks(user.id)

    // Demo analytics data
    return NextResponse.json({
      totalWatchTime: 12,
      coursesCompleted: 3,
      currentStreak: 5,
      quizzesPassed: 8,
      videosWatched: 45,
      bookmarks: bookmarks.length,
      emotionStats,
      weeklyProgress: [
        { day: "Mon", minutes: 45 },
        { day: "Tue", minutes: 60 },
        { day: "Wed", minutes: 30 },
        { day: "Thu", minutes: 90 },
        { day: "Fri", minutes: 75 },
        { day: "Sat", minutes: 120 },
        { day: "Sun", minutes: 45 },
      ],
      emotionTrend: [
        { date: "Mar 10", happy: 60, neutral: 30, confused: 10 },
        { date: "Mar 11", happy: 55, neutral: 35, confused: 10 },
        { date: "Mar 12", happy: 70, neutral: 20, confused: 10 },
        { date: "Mar 13", happy: 65, neutral: 25, confused: 10 },
        { date: "Mar 14", happy: 75, neutral: 20, confused: 5 },
        { date: "Mar 15", happy: 80, neutral: 15, confused: 5 },
        { date: "Mar 16", happy: 85, neutral: 10, confused: 5 },
      ],
      subjectProgress: [
        { subject: "Mathematics", progress: 75 },
        { subject: "Science", progress: 60 },
        { subject: "English", progress: 85 },
        { subject: "Hindi", progress: 45 },
      ]
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({
      totalWatchTime: 12,
      coursesCompleted: 3,
      currentStreak: 5,
      quizzesPassed: 8,
      videosWatched: 45,
      bookmarks: 12,
    })
  }
}
