import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Vendor Management', href: '/vendors', icon: BuildingOfficeIcon },
  { name: 'Fleet Management', href: '/fleet', icon: TruckIcon },
  { name: 'Driver Management', href: '/drivers', icon: UserGroupIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-gray-900 w-64">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">Vendor Cab System</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 px-6">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(
                      location.pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}