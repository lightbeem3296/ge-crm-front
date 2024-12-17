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
      <main className="flex-1 w-full z-10 lg:ml-64">
        <Header setMobileFiltersOpen={setMobileFiltersOpen} />
        <div className='px-4 rounded-md mt-4'>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
