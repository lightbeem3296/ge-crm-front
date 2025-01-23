'use client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-primary/5">
      {children}
    </div>
  )
}
