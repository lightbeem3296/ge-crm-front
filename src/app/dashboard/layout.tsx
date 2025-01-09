'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Example({ children }: { children: React.ReactNode }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="bg-base-100 flex min-h-screen">
        <Sidebar mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} />
        <main className="flex-1 w-full z-10 lg:ml-60">
          <Navbar setMobileFiltersOpen={setMobileFiltersOpen} />
          <div className='rounded-md px-4 mt-4 overflow-auto'>
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
