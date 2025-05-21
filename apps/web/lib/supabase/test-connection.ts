// This file is for testing the Supabase connection

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get your Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Check if we can get the current user session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Session status:', data.session ? 'Active session' : 'No active session');
    
    // Try to access a table to test database connection
    console.log('\nTesting database access...');
    const { data: categories, error: dbError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (dbError) {
      if (dbError.code === '42P01') {
        console.log('ℹ️ Table "categories" does not exist yet. You need to create the database schema.');
        console.log('Please run the SQL scripts in packages/database/supabase-create-tables.sql');
      } else {
        throw dbError;
      }
    } else {
      console.log('✅ Successfully accessed the database!');
      console.log('Retrieved categories:', categories);
    }
    
  } catch (err: any) {
    console.error('❌ Error connecting to Supabase:', err.message);
    process.exit(1);
  }
}

// Run the test
testConnection(); 