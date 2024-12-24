'use client'

import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ThemeController from '../ui/ThemeController';

interface HeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setMobileFiltersOpen }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-gray-100/80 sticky top-0 backdrop-blur-md z-10">
      <div className='flex items-center gap-x-2'>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
        >
          <Bars3Icon aria-hidden="true" className="size-5" />
        </button>
        <h1 className="text-md font-bold tracking-tight text-gray-600">Navigation Bar</h1>
      </div>
      <div className="flex items-center">
        <ThemeController />
        <button type="button" className="ml-2 p-2 text-gray-400 hover:text-gray-500">
          <Squares2X2Icon aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  )
}
