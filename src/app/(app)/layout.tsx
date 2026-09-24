import { Toaster } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
