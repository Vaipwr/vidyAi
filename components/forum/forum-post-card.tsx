"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, Share2, Bookmark, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ForumPost } from "@/lib/db"

interface ForumPostCardProps {
  post: ForumPost
  onUpdate: () => void
}

const categoryColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  Science: "bg-green-100 text-green-700",
  English: "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-700",
  "AI Explanations": "bg-violet-100 text-violet-700",
}

export function ForumPostCard({ post, onUpdate }: ForumPostCardProps) {
  const { toast } = useToast()
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const handleUpvote = async () => {
    try {
      const res = await fetch(`/api/forum/${post.id}/upvote`, {
        method: "POST",
      })
      if (res.ok) {
        if (hasUpvoted) {
          setUpvotes((prev) => prev - 1)
        } else {
          setUpvotes((prev) => prev + 1)
        }
        setHasUpvoted(!hasUpvoted)
      }
    } catch (error) {
      console.error("Failed to upvote:", error)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content.substring(0, 100),
        url: `${window.location.origin}/dashboard/community/${post.id}`,
      })
    } catch {
      await navigator.clipboard.writeText(
        `${window.location.origin}/dashboard/community/${post.id}`
      )
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard.",
      })
    }
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Upvote Column */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpvote}
              className={hasUpvoted ? "text-primary" : "text-muted-foreground"}
            >
              <ThumbsUp className={`h-5 w-5 ${hasUpvoted ? "fill-current" : ""}`} />
            </Button>
            <span className="text-sm font-medium">{upvotes}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={categoryColors[post.category] || "bg-gray-100 text-gray-700"}
                  >
                    {post.category}
                  </Badge>
                  {post.isAiGenerated && (
                    <Badge variant="outline" className="gap-1 bg-primary/10 text-primary">
                      <Sparkles className="h-3 w-3" />
                      AI Generated
                    </Badge>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.userAvatar} />
                  <AvatarFallback className="text-xs">
                    {post.userName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {post.userName || "Anonymous"} •{" "}
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {post.replies || 0}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
