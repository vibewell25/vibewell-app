#!/usr/bin/env node

// Script to create a test user in Supabase
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
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test user details
const testUserEmail = 'testuser@vibewell.com';
const testUserPassword = 'Test123456!';
const testUserFirstName = 'Test';
const testUserLastName = 'User';
const testUserRole = 'CUSTOMER'; // ADMIN, PROVIDER, or CUSTOMER

async function createTestUser() {
  console.log(`Creating test user with email: ${testUserEmail}`);
  
  try {
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUserEmail,
      password: testUserPassword,
      options: {
        data: {
          first_name: testUserFirstName,
          last_name: testUserLastName
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed, no user returned');
    }
    
    console.log(`✅ Auth user created with ID: ${authData.user.id}`);
    
    // Step 2: Create profile in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        userId: authData.user.id,
        email: testUserEmail,
        firstName: testUserFirstName,
        lastName: testUserLastName,
        role: testUserRole
      })
      .select()
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    console.log(`✅ Profile created with ID: ${profileData.id}`);
    console.log('\nTest user details:');
    console.log(`- Email: ${testUserEmail}`);
    console.log(`- Password: ${testUserPassword}`);
    console.log(`- Role: ${testUserRole}`);
    console.log('\nYou can now sign in with these credentials.');
    
  } catch (err) {
    if (err.code === '23505') {
      console.error('❌ Error: A user with this email already exists.');
    } else {
      console.error('❌ Error creating test user:', err.message);
    }
  }
}

// Execute the function
createTestUser(); 