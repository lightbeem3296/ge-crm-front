'use client'

import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'

interface HeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setMobileFiltersOpen }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-100 rounded-md">
      <h1 className="text-md font-bold tracking-tight text-gray-600">New Arrivals</h1>
      <div className="flex items-center">
        <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
          <span className="sr-only">View grid</span>
          <Squares2X2Icon aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
        >
          <Bars3Icon aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  )
}
