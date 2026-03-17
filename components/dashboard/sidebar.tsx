"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  LayoutDashboard, 
  Video, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Bookmark,
  Bell,
  Settings,
  Award,
  HelpCircle
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/courses", icon: Video },
  { name: "Mentors", href: "/dashboard/mentors", icon: Users },
  { name: "Community", href: "/dashboard/community", icon: MessageSquare },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

const secondaryNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              VidyAI<span className="text-sidebar-primary">++</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="my-4 border-t border-sidebar-border" />

          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Streak Card */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary/20">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground">Keep Learning!</p>
                <p className="text-xs text-sidebar-foreground/70">Maintain your streak</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
