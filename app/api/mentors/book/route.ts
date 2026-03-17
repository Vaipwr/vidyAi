import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mentorId, date, time, message } = body

    if (!mentorId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const mentor = db.getMentor(mentorId)
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
    }

    // In a real app, this would create a booking record
    // For demo, we just return success
    return NextResponse.json({ 
      success: true,
      booking: {
        mentorId,
        mentorName: mentor.name,
        date,
        time,
        message,
        status: "confirmed"
      }
    })
  } catch (error) {
    console.error("Error booking session:", error)
    return NextResponse.json({ error: "Failed to book session" }, { status: 500 })
  }
}
