'use client'

import AdminRoute from '@/components/AdminRoute'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      {children}
    </AdminRoute>
  )
}
