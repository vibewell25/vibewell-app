'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MobileAppRedirect from './mobile-app-redirect';

// Development flag - set to true to disable redirects during development
const DEV_MODE = true;

// List of routes where we should never show the banner
const PROVIDER_ROUTES = ['/provider', '/admin', '/dashboard', '/auth'];

// List of consumer routes where we want to show the banner
const CONSUMER_ROUTES = [
  '/services',
  '/providers',
  '/booking',
  '/bookings',
  '/profile',
  '/search',
  '/cart',
  '/checkout',
  '/reviews',
  '/messages',
  '/social',
  '/virtual-tryon',
  '/rewards',
  '/notifications',
  '/courses',
  '/learning',
];

export function MobileAppRedirectWrapper({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Don't show the banner if in development mode
    if (DEV_MODE) {
      setShowBanner(false);
      return;
    }
    
    // Don't show the banner if we're on a provider route
    if (PROVIDER_ROUTES.some(route => pathname.startsWith(route))) {
      setShowBanner(false);
      return;
    }
    
    // Always show the banner if we're on a consumer route
    if (CONSUMER_ROUTES.some(route => pathname.startsWith(route))) {
      setShowBanner(true);
      return;
    }
    
    // Check if we've been redirected from a consumer route
    const fromRoute = searchParams.get('from');
    if (fromRoute && CONSUMER_ROUTES.some(route => fromRoute.startsWith(route))) {
      setShowBanner(true);
      return;
    }
    
    // Don't show the banner by default
    setShowBanner(false);
  }, [pathname, searchParams]);
  
  return (
    <>
      {children}
      {showBanner && <MobileAppRedirect />}
    </>
  );
} 