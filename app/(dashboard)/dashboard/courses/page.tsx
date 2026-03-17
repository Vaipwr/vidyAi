import { db } from "@/lib/db"
import { CourseGrid } from "@/components/courses/course-grid"
import { CourseFilters } from "@/components/courses/course-filters"

export default function CoursesPage() {
  const allCourses = db.getAllCourses()
  const categories = [...new Set(allCourses.map(c => c.subject))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our collection of courses and start learning today
        </p>
      </div>

      <CourseFilters categories={categories} />
      
      <CourseGrid courses={allCourses} />
    </div>
  )
}
