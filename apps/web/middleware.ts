import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Development mode flag - set to true to disable redirects during development
const DEV_MODE = true;

// Routes that are primarily for consumers and should redirect to the mobile app
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
]

// Routes that should be fully accessible on web without redirection
const ALLOWED_WEB_ROUTES = [
  '/',
  '/about',
  '/download',
  '/auth',
  '/provider',
  '/admin',
  '/dashboard',
  '/api',
]

// Paths that start with these will be allowed without redirection
const ALLOWED_WEB_PREFIXES = [
  '/provider/',
  '/admin/',
  '/auth/',
  '/api/',
  '/dashboard/',
  '/_next/',
  '/fonts/',
  '/images/',
  '/assets/',
]

/**
 * Middleware for handling authentication and protected routes
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createMiddlewareClient({ req, res })
    
    // Skip redirect logic entirely in development mode
    if (DEV_MODE) {
      // Early return to completely bypass redirection logic in development
      return res;
    }
    
    // Check if the path should redirect to mobile app
    const path = req.nextUrl.pathname
    
    // Check if this is a direct match for consumer routes
    const isConsumerRoute = CONSUMER_ROUTES.includes(path)
    
    // Check if this is a match for allowed web routes
    const isAllowedWebRoute = ALLOWED_WEB_ROUTES.includes(path)
    
    // Check if this is a prefix match for allowed web paths
    const hasAllowedPrefix = ALLOWED_WEB_PREFIXES.some(prefix => 
      path.startsWith(prefix)
    )
    
    // If this is a consumer route and not an allowed web route/prefix, redirect to download page
    if (isConsumerRoute && !isAllowedWebRoute && !hasAllowedPrefix) {
      // We could also check for a mobile device here and just add a query param
      // instead of redirecting, to show a banner
      const downloadUrl = new URL('/download', req.url)
      downloadUrl.searchParams.set('from', path)
      return NextResponse.redirect(downloadUrl)
    }

    // Refresh session if available
    const { data: { session } } = await supabase.auth.getSession()

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

// Configure which paths the middleware should run on
export const config = {
  // Skip API routes, static files, and public assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api/).*)'],
} 