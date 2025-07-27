'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Pages that should have mobile-only layout (ecommerce pages)
const ECOMMERCE_PATHS = [
  '/',
  '/search',
  '/product',
  '/cart'
];

// Pages that should NOT have mobile-only layout (merchant pages)
const MERCHANT_PATHS = [
  '/merchant',
  '/merchant/login',
  '/merchant/onboarding',
  '/merchant/success',
  '/signin',
  '/signup',
  '/dashboard',
  '/api'
];

export function EcommerceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const body = document.body;
    
    // Check if current path is an ecommerce page
    const isEcommercePage = ECOMMERCE_PATHS.some(path => 
      pathname.startsWith(path)
    );
    
    // Check if current path is a merchant page
    const isMerchantPage = MERCHANT_PATHS.some(path => 
      pathname.startsWith(path)
    );
    
    // Only apply ecommerce-page class if it's an ecommerce page and not a merchant page
    if (isEcommercePage && !isMerchantPage) {
      body.classList.add('ecommerce-page');
    } else {
      body.classList.remove('ecommerce-page');
    }
  }, [pathname]);

  return <>{children}</>;
} 