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
const testUserEmail = 'testuser2@vibewell.com';
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
    console.log('Note: You may need to manually create the profile in the Supabase dashboard.');
    console.log('\nSQL to create profile:');
    console.log(`
INSERT INTO profiles ("userId", email, "firstName", "lastName", role)
VALUES 
  ('${authData.user.id}', '${testUserEmail}', '${testUserFirstName}', '${testUserLastName}', '${testUserRole}');
    `);
    
    console.log('\nTest user details:');
    console.log(`- Email: ${testUserEmail}`);
    console.log(`- Password: ${testUserPassword}`);
    console.log(`- Role: ${testUserRole}`);
    console.log('\nRemember to verify your email through the verification link sent to your email inbox.');
    
  } catch (err) {
    console.error('❌ Error creating test user:', err.message);
  }
}

// Execute the function
createTestUser();
