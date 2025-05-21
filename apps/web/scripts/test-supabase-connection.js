#!/usr/bin/env node

// Simple script to test Supabase connection
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Check if we can get the current user session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully connected to Supabase Auth!');
    console.log('Session status:', data.session ? 'Active session' : 'No active session');
    
    // Try to query the database
    console.log('\nTesting database access...');
    try {
      const { data: categories, error: dbError } = await supabase
        .from('categories')
        .select('*')
        .limit(1);
      
      if (dbError) {
        if (dbError.code === '42P01') {
          console.log('ℹ️ Table "categories" does not exist yet. You need to create the database schema.');
          console.log('Open the Supabase dashboard and run the SQL scripts in:');
          console.log('  packages/database/supabase-create-tables.sql');
          console.log('  packages/database/supabase-rls-policies.sql');
        } else {
          throw dbError;
        }
      } else {
        console.log('✅ Successfully accessed the database!');
        console.log('Retrieved categories:', categories);
      }
    } catch (dbErr) {
      console.error('❌ Error accessing database:', dbErr.message);
    }
    
  } catch (err) {
    console.error('❌ Error connecting to Supabase Auth:', err.message);
  }
}

// Run the test
testConnection(); 