"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Video, Clock } from "lucide-react"
import type { Mentor } from "@/lib/db"

interface MentorCardProps {
  mentor: Mentor
  onBook: () => void
}

export function MentorCard({ mentor, onBook }: MentorCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-r from-primary/80 to-primary">
          <Avatar className="absolute -bottom-8 left-4 h-16 w-16 border-4 border-card">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback className="bg-primary-foreground text-primary text-xl">
              {mentor.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="px-4 pb-4 pt-10">
          {/* Name and Rating */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.expertise.join(", ")}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{mentor.bio}</p>

          {/* Languages */}
          <div className="mt-3 flex flex-wrap gap-1">
            {mentor.languages.slice(0, 3).map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
            {mentor.languages.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{mentor.languages.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>{mentor.sessionsCompleted} sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>30-60 min</span>
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-foreground">
                {mentor.hourlyRate === 0 ? "Free" : `Rs. ${mentor.hourlyRate}`}
              </span>
              {mentor.hourlyRate > 0 && (
                <span className="text-sm text-muted-foreground">/hour</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button onClick={onBook}>Book Session</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
