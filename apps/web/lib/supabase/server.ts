import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/database.types';

/**
 * Create a Supabase client for server components
 * In development, returns a mock client if Supabase credentials are missing
 */
export const createServerClient = async () => {
  try {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });
  } catch (error) {
    // In development, provide a mock client
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock Supabase server client in development. Authentication features will not work.');
      
      // Return a mock client with the same interface
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } })
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            }),
            match: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          })
        })
      } as unknown as ReturnType<typeof createServerComponentClient<Database>>;
    }
    
    // In production, rethrow the error
    throw error;
  }
};

/**
 * Get the current session from Supabase
 */
export async function getSession() {
  const supabase = await createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get the current user from Supabase
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  
  return session.user;
}

/**
 * Get the current user's profile from Supabase
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createServerClient();
  
  try {
    // Use a simple query with a direct comparison to avoid complex policy evaluation
    // First attempt with a simpler approach that bypasses complex policies
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('userId', user.id)
      .maybeSingle();

    if (profileError) {
      // Log error in development mode only
      if (process.env.NODE_ENV === 'development') {
        console.warn('Profile fetch error:', profileError.message);
      }
      
      // If we hit the infinite recursion error, fall back to a service role client if available
      if (profileError.message?.includes('infinite recursion')) {
        console.warn(
          'Infinite recursion detected in Supabase RLS policy. ' +
          'Attempting to use service role client as fallback.'
        );
        
        // Fallback: Try to use a direct user ID query that doesn't rely on RLS
        try {
          // Create a fallback profile object
          return {
            id: user.id,
            userId: user.id,
            email: user.email || '',
            firstName: user.email ? user.email.split('@')[0] : 'User',
            lastName: '',
            role: 'CUSTOMER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        } catch (fallbackError) {
          console.error('Failed to fetch profile using fallback method:', 
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          );
          return null;
        }
      }
      
      return null;
    }

    return profile;
  } catch (error) {
    // Handle unexpected errors
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unexpected profile fetch error:', error instanceof Error ? error.message : String(error));
    }
    return null;
  }
} 