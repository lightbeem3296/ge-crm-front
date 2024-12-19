'use client'

import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setMobileFiltersOpen }: HeaderProps) {
  const themeList = [
    {
      name: "light",
      value: "light",
    },
    {
      name: "dark",
      value: "dark",
    },
    {
      name: "cupcake",
      value: "cupcake",
    },
    {
      name: "emerald",
      value: "emerald",
    },
    {
      name: "synthwave",
      value: "synthwave",
    },
    {
      name: "retro",
      value: "retro",
    },
    {
      name: "valentine",
      value: "valentine",
    },
    {
      name: "halloween",
      value: "halloween",
    },
    {
      name: "forest",
      value: "forest",
    },
    {
      name: "aqua",
      value: "aqua",
    },
    {
      name: "pastel",
      value: "pastel",
    },
    {
      name: "fantasy",
      value: "fantasy",
    },
    {
      name: "wireframe",
      value: "wireframe",
    },
    {
      name: "black",
      value: "black",
    },
    {
      name: "luxury",
      value: "luxury",
    },
    {
      name: "dracula",
      value: "dracula",
    },
    {
      name: "cmyk",
      value: "cmyk",
    },
    {
      name: "autumn",
      value: "autumn",
    },
    {
      name: "business",
      value: "business",
    },
    {
      name: "lemonade",
      value: "lemonade",
    },
    {
      name: "night",
      value: "night",
    },
    {
      name: "coffee",
      value: "coffee",
    },
    {
      name: "winter",
      value: "winter",
    },
    {
      name: "dim",
      value: "dim",
    },
    {
      name: "nord",
      value: "nord",
    },
    {
      name: "sunset",
      value: "sunset",
    },
  ];
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
        <div className="dropdown dropdown-left">
          <div tabIndex={0} role="button" className="btn btn-sm">
            Theme
            <FontAwesomeIcon icon={faAngleDown} width={12} />
          </div>
          <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-[calc(100vh-2rem)] overflow-auto">
            {
              themeList.map((theme) => (
                <li key={theme.value}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label={theme.name}
                    value={theme.value} />
                </li>
              ))
            }
          </ul>
        </div>
        <button type="button" className="ml-2 p-2 text-gray-400 hover:text-gray-500">
          <Squares2X2Icon aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  )
}
