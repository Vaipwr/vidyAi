import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const post = db.upvotePost(postId)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, upvotes: post.upvotes })
  } catch (error) {
    console.error("Error upvoting post:", error)
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 })
  }
}
