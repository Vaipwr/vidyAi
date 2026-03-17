import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { OfflineStatus } from "@/components/offline/offline-status"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"

// Demo user for the app (no login required)
const demoUser = {
  name: "Demo Student",
  email: "demo@vidyai.com",
  image: null,
  preferredLanguage: "en",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col lg:pl-72">
          <DashboardHeader user={demoUser} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
          <OfflineStatus />
        </div>
      </div>
    </LanguageProvider>
  )
}
