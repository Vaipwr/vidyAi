import { db } from "@/lib/db"
import { DashboardWelcome } from "@/components/dashboard/welcome"
import { DashboardStats } from "@/components/dashboard/stats"
import { ContinueLearning } from "@/components/dashboard/continue-learning"
import { RecommendedCourses } from "@/components/dashboard/recommended-courses"
import { LearningNudge } from "@/components/dashboard/learning-nudge"
import { DailyNudge } from "@/components/dashboard/daily-nudge"

export default function DashboardPage() {
  // Get data from in-memory store
  const allCourses = db.getAllCourses()
  const allVideos = db.getAllVideos()
  
  // Get recent videos with their course info
  const recentVideos = allVideos.slice(0, 4).map(video => {
    const course = db.getCourse(video.courseId)
    return { video, course }
  })

  return (
    <div className="space-y-6">
      <DashboardWelcome userName="Student" />
      
      <LearningNudge />
      
      <DashboardStats 
        totalCourses={allCourses.length}
        completedVideos={3}
        currentStreak={5}
        totalPoints={1250}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueLearning videos={recentVideos} />
        </div>
        <div className="space-y-6">
          <RecommendedCourses courses={allCourses.slice(0, 3)} />
          <DailyNudge />
        </div>
      </div>
    </div>
  )
}
