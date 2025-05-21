import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

/**
 * Create a Supabase client for server components
 * In development, returns a mock client if Supabase credentials are missing
 */
export const createServerClient = () => {
  try {
    return createServerComponentClient<Database>({
      cookies,
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
  const supabase = createServerClient();
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
 * Get the current user's profile from the database
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = createServerClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', user.id)
    .single();

  return data;
} 