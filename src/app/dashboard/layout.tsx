'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'


export default function Example({ children }: { children: React.ReactNode }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} />
      <main className="p-4 w-full">
        <Header setMobileFiltersOpen={setMobileFiltersOpen} />
        <div className='p-4'>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
