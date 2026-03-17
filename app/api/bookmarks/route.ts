import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")
    const user = db.getDefaultUser()

    console.log("[v0] Bookmarks GET - videoId:", videoId, "userId:", user?.id)

    const bookmarks = videoId 
      ? db.getBookmarksByVideo(videoId)
      : db.getBookmarks(user.id)

    console.log("[v0] Bookmarks found:", bookmarks?.length || 0)

    return NextResponse.json(bookmarks || [])
  } catch (error) {
    console.error("[v0] Error fetching bookmarks:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, timestamp, note, emotionState } = body
    const user = db.getDefaultUser()

    const bookmark = db.createBookmark({
      userId: user.id,
      videoId,
      timestamp,
      note: note || "",
      emotionState
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Bookmark ID required" }, { status: 400 })
    }

    db.deleteBookmark(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}
