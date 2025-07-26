'use client';

import {
  ChartBarIcon,
  Cog6ToothIcon,
  CubeIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  merchant: any;
}

const navigation = [
  { name: 'Dashboard', href: '/merchant', icon: HomeIcon },
  { name: 'Products', href: '/merchant/products', icon: CubeIcon },
  { name: 'Orders', href: '/merchant/orders', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/merchant/analytics', icon: ChartBarIcon },
  { name: 'Customers', href: '/merchant/customers', icon: UserGroupIcon },
  { name: 'Settings', href: '/merchant/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ merchant }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            {merchant?.businessInfo?.name || 'Merchant Dashboard'}
          </h1>
          <p className="text-xs text-gray-500">Business Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Merchant Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {merchant?.businessInfo?.name?.charAt(0) || 'M'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {merchant?.businessInfo?.name || 'Merchant'}
            </p>
            <p className="text-xs text-gray-500">
              {merchant?.businessInfo?.category || 'Business'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 