'use client'

import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'
import ThemeController from '../ui/theme/ThemeController';

interface HeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setMobileFiltersOpen }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-base-300 px-4 py-2 bg-base-100/80 sticky top-0 backdrop-blur-md z-10">
      <div className='flex items-center gap-x-2'>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn btn-sm btn-ghost lg:hidden"
        >
          <Bars3Icon aria-hidden="true" className="size-5" />
        </button>
        <h1 className="text-md font-bold tracking-tight text-base-content/70">Navigation Bar</h1>
      </div>
      <div className="flex gap-1 items-center">
        <ThemeController />
        <button className="btn btn-sm btn-ghost">
          <Squares2X2Icon aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  )
}
