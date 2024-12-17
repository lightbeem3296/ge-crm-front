'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'


export default function Example({ children }: { children: React.ReactNode }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="bg-white flex min-h-screen">
      <div className='bg-blue-600 w-full h-40 absolute z-0'></div>
      <Sidebar mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} />
      <main className="flex-1 p-4 w-full z-10">
        <Header setMobileFiltersOpen={setMobileFiltersOpen} />
        <div className='p-4'>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
