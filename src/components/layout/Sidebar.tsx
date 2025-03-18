import { loadCurrentUser } from '@/services/authService'
import { UserRole } from '@/types/auth'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'


interface SidebarProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>; // setMobileFiltersOpen function type
}

const createMenuItems = (role: UserRole) => {
  return (
    <ul className="menu w-full">
      <li className='menu-title'>MAIN</li>
      <li><Link href="/main/dashboard">Dashboard</Link></li>
      <li className='menu-title'>DATA</li>
      <li>
        <details>
          <summary>Employees</summary>
          <ul>
            {role === UserRole.ADMIN && <li><Link href="/main/data/user">Users</Link></li>}
            <li><Link href="/main/data/employee">Employees</Link></li>
            <li><Link href="/main/data/role">Roles</Link></li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Rules & Automation</summary>
          <ul>
            <li><Link href="/main/data/rule">Rules</Link></li>
            <li><Link href="/main/data/tag">Tags</Link></li>
            <li><Link href="/main/data/salary-type">Salary Types</Link></li>
          </ul>
        </details>
      </li>
      <li className='menu-title'>PAYROLL</li>
      <li>
        <details>
          <summary>Payroll Processing</summary>
          <ul>
            <li><Link href="#">Start new payroll</Link></li>
            <li><Link href="#">Scheduled payrolls</Link></li>
            <li><Link href="#">Payroll history</Link></li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Export & Reports</summary>
          <ul>
            <li><Link href="#">Payroll data export</Link></li>
            <li><Link href="#">Predefined reports</Link></li>
            <li><Link href="#">Custom export</Link></li>
          </ul>
        </details>
      </li>
      <li className="menu-title">SYSTEM SETTINGS</li>
      <li><Link href="#">Access & Roles</Link></li>
      <li><Link href="#">Integrations</Link></li>
      <li><Link href="#">Notifications & Automated Approvals</Link></li>
    </ul>
  )
}

export default function Sidebar({ mobileFiltersOpen, setMobileFiltersOpen }: SidebarProps) {
  const currentUser = loadCurrentUser();
  return (
    <div className="w-72 h-full hidden lg:flex flex-col bg-neutral-900 p-4 z-10 fixed">
      <div className='grow-0 py-4 border-b border-gray-600'>
        <p className='text-md text-gray-200 font-medium uppercase'>Dashboard</p>
        <p className='text-sm text-gray-400'>Employee & Payroll</p>
      </div>
      <div className='grow overflow-y-auto mt-4'>
        {createMenuItems(currentUser?.role || UserRole.USER)}
      </div>

      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-neutral-900 py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4 border-b border-gray-600">
              <div className='py-4'>
                <p className='text-md text-gray-200 font-medium uppercase'>Dashboard</p>
                <p className='text-sm text-gray-400'>Employee & Payroll</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="-mr-2 flex size-10 items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {createMenuItems(currentUser?.role || UserRole.USER)}
          </DialogPanel>
        </div>
      </Dialog>
    </div >
  )
}
