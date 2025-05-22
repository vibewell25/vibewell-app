#!/usr/bin/env node

// This script fixes the RLS recursion issue by applying a simplified policy structure
// Run with: node scripts/fix-rls.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

// Create a Supabase client with the service role key (admin access)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  }
});

// SQL to fix the RLS recursion issue
const fixRlsSql = `
-- First, disable RLS for the profiles table (temporarily) to resolve any current issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Then re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for the profiles table to ensure a clean slate
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Providers can view customer profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;

-- Create a single simple policy for profile viewing that won't cause recursion
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = "userId");

-- Create a simple policy for profile updates
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = "userId");

-- Create a simple policy for profile creation
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Add a simplified admin view policy
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
  )
);
`;

async function fixRLS() {
  console.log('🔧 Fixing RLS policies for profiles table...');
  
  try {
    // Execute the SQL to fix RLS
    const { error } = await supabase.rpc('pgmoon_exec', {
      query_text: fixRlsSql
    });
    
    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      
      // Try direct SQL execution
      console.log('Trying alternative method...');
      
      // Split the SQL into individual statements
      const statements = fixRlsSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      let success = true;
      
      // Execute each statement separately
      for (const statement of statements) {
        const { error } = await supabase.rpc('pgmoon_exec', {
          query_text: statement + ';'
        });
        
        if (error) {
          console.error(`❌ Error executing statement: ${statement}`);
          console.error(`   Error message: ${error.message}`);
          success = false;
          break;
        }
      }
      
      if (success) {
        console.log('✅ Successfully fixed RLS policies!');
      } else {
        console.error('❌ Failed to fix RLS policies.');
        console.log('\nPlease run the following SQL manually in the Supabase Dashboard SQL Editor:');
        console.log('\n----- SQL TO RUN -----');
        console.log(fixRlsSql);
        console.log('----- END SQL -----');
      }
    } else {
      console.log('✅ Successfully fixed RLS policies!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.log('\nPlease run the following SQL manually in the Supabase Dashboard SQL Editor:');
    console.log('\n----- SQL TO RUN -----');
    console.log(fixRlsSql);
    console.log('----- END SQL -----');
  }
}

// Run the function
fixRLS(); 