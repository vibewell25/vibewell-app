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
      console.warn('Using mock Supabase client in development. Some features will not work.');
      
      // Return a mock client with the same interface
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          getUser: () => Promise.resolve({ data: { user: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          // Add other methods as needed
        },
        // Mock database query methods
        from: (table: string) => {
          const mockQueryBuilder = {
            select: () => mockQueryBuilder,
            eq: () => mockQueryBuilder,
            neq: () => mockQueryBuilder,
            gt: () => mockQueryBuilder,
            lt: () => mockQueryBuilder,
            gte: () => mockQueryBuilder,
            lte: () => mockQueryBuilder,
            order: () => mockQueryBuilder,
            range: () => mockQueryBuilder,
            limit: () => mockQueryBuilder,
            single: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            then: (callback: any) => Promise.resolve(callback({ data: [], error: null })),
          };
          return mockQueryBuilder;
        },
        // Add other Supabase client properties as needed
      } as unknown as ReturnType<typeof createClientComponentClient<Database>>;
    }
    
    // In production, rethrow the error
    throw error;
  }
}; 