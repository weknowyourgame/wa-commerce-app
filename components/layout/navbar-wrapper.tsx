'use client';

import type { MerchantWithProducts } from 'lib/types';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

// Pages that should NOT show the navbar (merchant pages)
const NO_NAVBAR_PATHS = [
  '/merchant',
  '/merchant/login',
  '/merchant/onboarding',
  '/merchant/success',
  '/signin',
  '/signup',
  '/dashboard',
  '/api' // API routes
];

export function NavbarWrapper({ merchant }: { merchant: MerchantWithProducts | null }) {
  const pathname = usePathname();
  
  // Check if current path should show navbar
  const shouldShowNavbar = !NO_NAVBAR_PATHS.some(path => 
    pathname.startsWith(path)
  );

  // Debug logging (remove in production)
  console.log('NavbarWrapper:', { pathname, shouldShowNavbar });

  // Don't render anything if we shouldn't show navbar
  if (!shouldShowNavbar) {
    return null;
  }

  return <Navbar merchant={merchant} />;
} 