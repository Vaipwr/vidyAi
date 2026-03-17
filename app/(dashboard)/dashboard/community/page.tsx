"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForumPostCard } from "@/components/forum/forum-post-card"
import { CreatePostDialog } from "@/components/forum/create-post-dialog"
import { Search, Plus, TrendingUp, Clock, MessageSquare } from "lucide-react"
import type { ForumPost } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { data: posts, isLoading, mutate } = useSWR<ForumPost[]>(
    `/api/forum?category=${selectedCategory}&sort=${sortBy}&search=${searchQuery}`,
    fetcher
  )

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "AI Explanations", label: "AI Explanations" },
    { id: "Mathematics", label: "Mathematics" },
    { id: "Science", label: "Science" },
    { id: "English", label: "English" },
    { id: "General", label: "General" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Community Forum</h1>
        <p className="mt-1 text-muted-foreground">
          Connect with fellow learners, share knowledge, and get help
        </p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort Tabs */}
      <Tabs value={sortBy} onValueChange={setSortBy}>
        <TabsList>
          <TabsTrigger value="recent" className="gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ForumPostCard key={post.id} post={post} onUpdate={mutate} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No posts yet</h3>
          <p className="mt-2 text-muted-foreground">
            Be the first to start a discussion!
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            Create Post
          </Button>
        </div>
      )}

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          mutate()
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
}
