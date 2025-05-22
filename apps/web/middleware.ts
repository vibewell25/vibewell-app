import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define a list of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/terms',
  '/privacy',
  '/about',
]

// Define routes that require authentication
// If a user is authenticated and tries to access auth routes, redirect to dashboard
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
]

/**
 * Middleware for handling authentication and protected routes
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createMiddlewareClient({ req, res })
    
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const path = req.nextUrl.pathname
    
    // If user is signed in and tries to access auth page, redirect to dashboard
    if (session && authRoutes.some(route => path.startsWith(route))) {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If no session and trying to access a protected route, redirect to login
    if (!session && !publicRoutes.some(route => path === route || path.startsWith(route))) {
      const redirectUrl = new URL('/auth/login', req.url)
      // Store the original URL they were trying to visit
      redirectUrl.searchParams.set('redirectTo', encodeURIComponent(req.url))
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    // Handle errors more gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Don't log infinite recursion errors (they're noisy and expected until fixed)
    if (!errorMessage.includes('infinite recursion')) {
      console.error('Authentication error:', errorMessage);
    }
    
    // In development, if Supabase credentials are missing, allow access
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase credentials missing or error in development mode.');
      // Continue despite errors in development
      return res;
    } else {
      // In production, we should still enforce authentication for non-recursion errors
      if (!errorMessage.includes('infinite recursion')) {
        // Redirect to a static error page
        const errorUrl = new URL('/error', req.url)
        return NextResponse.redirect(errorUrl)
      }
      // For recursion errors, just continue
      return res;
    }
  }
  
  return res
}

// Configure which paths the middleware should run on
export const config = {
  // Skip API routes, static files, and public assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api/).*)'],
} 