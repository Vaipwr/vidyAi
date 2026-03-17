"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

interface CourseFiltersProps {
  categories: string[]
}

export function CourseFilters({ categories }: CourseFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("courses.search.placeholder")}
          className="pl-9"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          {t("courses.filter.label")}
        </span>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          {t("courses.filter.all")}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
