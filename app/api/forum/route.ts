import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const videoId = searchParams.get("videoId") || undefined

    const posts = db.getAllForumPosts({ 
      category: category === "all" ? undefined : category, 
      videoId 
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, videoId, isAiGenerated, videoTitle, timestamp } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = db.getDefaultUser()

    const post = db.createForumPost({
      userId: user.id,
      userName: isAiGenerated ? "AI Assistant" : user.name,
      userAvatar: isAiGenerated 
        ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=50&h=50&fit=crop'
        : 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop&crop=face',
      title,
      content,
      category,
      videoId,
      isAiGenerated,
      videoTitle,
      timestamp
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating forum post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
