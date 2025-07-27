import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import type { MerchantWithProducts } from 'lib/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

// Simple menu structure - you can expand this based on your needs
const menu = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/search' },
  { title: 'About', path: '/about' }
];

export async function Navbar({ merchant }: { merchant: MerchantWithProducts | null }) {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 ecommerce-navbar">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} merchant={merchant} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {merchant?.businessInfo?.name || SITE_NAME}
            </div>
          </Link>
          {merchant && (
            <div className="hidden md:block ml-4 text-xs text-gray-500">
              {merchant.businessInfo?.description}
            </div>
          )}
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
