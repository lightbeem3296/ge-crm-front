'use client'

import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-primary/10">
      {children}
    </div>
  )
}
