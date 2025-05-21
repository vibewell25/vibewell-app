"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./database.types";

/**
 * Create a Supabase client for client components
 * In development, returns a mock client if Supabase credentials are missing
 */
export const createClient = () => {
  try {
    return createClientComponentClient<Database>();
  } catch (error) {
    // In development, provide a mock client if credentials are missing
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock Supabase client in development. Authentication features will not work.');
      
      // Return a mock client with the same interface
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          // Add other methods as needed
        },
        // Add other Supabase client properties as needed
      } as unknown as ReturnType<typeof createClientComponentClient<Database>>;
    }
    
    // In production, rethrow the error
    throw error;
  }
}; 