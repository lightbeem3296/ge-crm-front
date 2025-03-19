import { loadCurrentUser } from '@/services/authService'
import { UserRole } from '@/types/auth'
import { cn } from '@/utils/cn'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'

interface MenuItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, label, icon }) => {
  const pathname = usePathname(); // Get the current route

  console.log(pathname, href);

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-700 focus:bg-blue-600 focus:text-gray-200",
          pathname === href
            ? "bg-blue-600"
            : ""
        )}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </Link>
    </li>
  );
};


const createMenuItems = (role: UserRole) => {
  return (
    <ul className="menu w-full text-gray-300">
      <li className='menu-title text-gray-600'>MAIN</li>
      <MenuItem href="/main/dashboard" label="Dasbhoard" />
      <li className='menu-title text-gray-600'>DATA</li>
      <li>
        <details>
          <summary>Employees</summary>
          <ul>
            {role === UserRole.ADMIN && <MenuItem href="/main/data/user" label="Users" />}
            <MenuItem href="/main/data/employee" label="Employees" />
            <MenuItem href="/main/data/role" label="Roles" />
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Rules & Automation</summary>
          <ul>
            <MenuItem href="/main/data/rule" label="Rules" />
            <MenuItem href="/main/data/tag" label="Tags" />
            <MenuItem href="/main/data/salary-type" label="Salary Types" />
          </ul>
        </details>
      </li>
      <li className='menu-title text-gray-600'>PAYROLL</li>
      <li>
        <details>
          <summary>Payroll Processing</summary>
          <ul>
            <MenuItem href="#" label="Start new payroll" />
            <MenuItem href="#" label="Scheduled payrolls" />
            <MenuItem href="#" label="Payroll history" />
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Export & Reports</summary>
          <ul>
            <MenuItem href="/main/payroll/export" label="Payroll data export" />
            <MenuItem href="#" label="Predefined reports" />
            <MenuItem href="#" label="Custom export" />
          </ul>
        </details>
      </li>
      <li className="menu-title text-gray-600">SYSTEM SETTINGS</li>
      <MenuItem href="#" label="Access & Roles" />
      <MenuItem href="#" label="Integrations" />
      <MenuItem href="#" label="Notifications & Automated Approvals" />
    </ul>
  )
}

interface SidebarProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>; // setMobileFiltersOpen function type
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
