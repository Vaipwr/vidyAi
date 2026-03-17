"use client"

import { useState } from "react"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { MentorCard } from "@/components/mentors/mentor-card"
import { BookMentorDialog } from "@/components/mentors/book-mentor-dialog"
import { Search, Users } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import type { Mentor } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MentorsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)

  const { data: mentors, isLoading } = useSWR<Mentor[]>(
    selectedExpertise === "all"
      ? `/api/mentors?search=${searchQuery}`
      : `/api/mentors?expertise=${selectedExpertise}&search=${searchQuery}`,
    fetcher
  )

  const expertiseOptions = [
    { id: "all", label: "All Subjects" },
    { id: "Mathematics", label: "Mathematics" },
    { id: "Physics", label: "Physics" },
    { id: "Chemistry", label: "Chemistry" },
    { id: "Biology", label: "Biology" },
    { id: "Computer Science", label: "Computer Science" },
    { id: "English", label: "English" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentors</h1>
        <p className="mt-1 text-muted-foreground">
          Mentors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("dash.mentors.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Expertise Filters */}
      <div className="flex flex-wrap gap-2">
        {expertiseOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedExpertise(option.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedExpertise === option.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : mentors && mentors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onBook={() => setSelectedMentor(mentor)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">{t("dash.mentors.empty.title")}</h3>
          <p className="mt-2 text-muted-foreground">
            {t("dash.mentors.empty.desc")}
          </p>
        </div>
      )}

      {/* Book Mentor Dialog */}
      {selectedMentor && (
        <BookMentorDialog
          mentor={selectedMentor}
          open={!!selectedMentor}
          onOpenChange={(open) => !open && setSelectedMentor(null)}
        />
      )}
    </div>
  )
}
