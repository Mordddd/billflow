import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | BillFlow",
  description: "Sign in to your BillFlow account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
