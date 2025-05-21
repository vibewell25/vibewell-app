// Script to create a provider test user in Supabase
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
const testUserEmail = 'provider@vibewell.com';
const testUserPassword = 'Provider123!';
const testUserFirstName = 'Beauty';
const testUserLastName = 'Provider';
const testUserRole = 'PROVIDER'; // ADMIN, PROVIDER, or CUSTOMER

async function createProviderUser() {
  console.log(`Creating provider user with email: ${testUserEmail}`);
  
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
    
    // Step 2: Try to sign in immediately
    console.log('\nAttempting to sign in with the new user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });
    
    if (signInError) {
      console.error('❌ Sign-in failed:', signInError.message);
      console.log('You will need to manually verify this user in the Supabase dashboard.');
    } else {
      console.log('✅ Sign-in successful!');
      
      // Step 3: Create profile in the profiles table directly using SQL
      console.log('\nCreating profile record...');
      console.log('Please execute this SQL in the Supabase SQL Editor:');
      console.log(`
INSERT INTO profiles ("userId", email, "firstName", "lastName", role)
VALUES 
  ('${authData.user.id}', '${testUserEmail}', '${testUserFirstName}', '${testUserLastName}', '${testUserRole}');
      `);
    }
    
    console.log('\nProvider user details:');
    console.log(`- Email: ${testUserEmail}`);
    console.log(`- Password: ${testUserPassword}`);
    console.log(`- Role: ${testUserRole}`);
    
  } catch (err) {
    if (err.code === '23505') {
      console.error('❌ Error: A user with this email already exists.');
    } else {
      console.error('❌ Error creating provider user:', err.message);
    }
  }
}

// Execute the function
createProviderUser(); 