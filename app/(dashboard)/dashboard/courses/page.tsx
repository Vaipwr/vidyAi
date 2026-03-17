"use client"

import { db } from "@/lib/db"
import { CourseGrid } from "@/components/courses/course-grid"
import { CourseFilters } from "@/components/courses/course-filters"
import { useTranslation } from "@/lib/i18n/LanguageContext"

export default function CoursesPage() {
  const { t } = useTranslation()
  const allCourses = db.getAllCourses()
  const categories = [...new Set(allCourses.map(c => c.subject))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("dash.courses.title")}</h1>
        <p className="mt-1 text-muted-foreground">
          {t("dash.courses.desc")}
        </p>
      </div>

      <CourseFilters categories={categories} />

      <CourseGrid courses={allCourses} />
    </div>
  )
}
