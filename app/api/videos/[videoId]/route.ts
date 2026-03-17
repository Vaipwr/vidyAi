import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    const video = db.getVideo(videoId)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const course = db.getCourse(video.courseId)
    const courseVideos = db.getVideosByCourse(video.courseId)

    return NextResponse.json({
      ...video,
      course,
      courseVideos
    })
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}
