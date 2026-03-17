import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = db.getDefaultUser()
    const stats = db.getEmotionStats(user.id)
    const logs = db.getEmotionLogs(user.id)

    return NextResponse.json({ 
      emotions: logs,
      summary: stats 
    })
  } catch (error) {
    console.error("Error fetching emotions:", error)
    return NextResponse.json({ error: "Failed to fetch emotions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emotion, confidence, videoId, timestamp } = body
    const user = db.getDefaultUser()

    db.logEmotion({
      userId: user.id,
      videoId: videoId || "",
      emotion,
      confidence: confidence || 0.5,
      timestamp: timestamp || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging emotion:", error)
    return NextResponse.json({ error: "Failed to log emotion" }, { status: 500 })
  }
}
