import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


enum SidebarMenuItemType {
  Title = 1,
  MenuItem,
  Separator,
}

const sideBarMenuItems = [
  {
    name: 'Data',
    href: '#',
    type: SidebarMenuItemType.Title,
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Tags',
    href: '/dashboard/tags',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Roles',
    href: '/dashboard/roles',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Rules',
    href: '/dashboard/rules',
    type: SidebarMenuItemType.MenuItem,
  },
  {
    name: 'Payroll',
    href: '#',
    type: SidebarMenuItemType.Title,
  },
]

interface SidebarProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>; // setMobileFiltersOpen function type
}


export default function Sidebar({ mobileFiltersOpen, setMobileFiltersOpen }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="w-72 hidden lg:block bg-neutral-900 px-8 m-4 rounded-xl">
      <div className='pt-10 pb-4 border-b border-gray-600'>
        <p className='text-md text-gray-200 font-medium uppercase'>Admin Panel</p>
        <p className='text-sm text-gray-400'>Employee & Payroll</p>
      </div>
      <ul className="text-sm mt-4">
        {sideBarMenuItems.map((menuItem) => (
          menuItem.type === SidebarMenuItemType.MenuItem ? (
            <Link
              key={menuItem.name}
              href={menuItem.href}
            >
              <li className={`px-4 py-2 rounded-md border border-transparent hover:text-blue-600 hover:border-gray-800 ${pathname == menuItem.href
                ? "font-semibold text-blue-600 bg-gray-900 border-gray-800"
                : "font-normal text-gray-300"
                }`}>
                {menuItem.name}
              </li>
            </Link>
          ) : menuItem.type === SidebarMenuItemType.Title ? (
            <li key={menuItem.name} className="text-gray-500 uppercase font-medium py-2">
              {menuItem.name}
            </li>
          ) : null
        ))}
      </ul>

      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <form className="mt-4 border-t border-gray-200">
              <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                {sideBarMenuItems.map((menuItem) => (
                  <li key={menuItem.name}>
                    <Link href={menuItem.href} className="block px-2 py-3">
                      {menuItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div >
  )
}
