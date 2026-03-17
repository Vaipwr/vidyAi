import { Users, BookOpen, Globe, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
    description: "Learning across India",
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Video Lessons",
    description: "Curated content",
  },
  {
    icon: Globe,
    value: "10+",
    label: "Languages",
    description: "Regional support",
  },
  {
    icon: Award,
    value: "95%",
    label: "Success Rate",
    description: "Course completion",
  },
]

export function LandingStats() {
  return (
    <section className="border-y border-border bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
