// Script to verify a test user in Supabase
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

// Test user details - update these to match the user you're trying to verify
const testUserEmail = 'testuser2@vibewell.com';
const testUserPassword = 'Test123456!';

async function verifyUser() {
  console.log(`Verifying user with email: ${testUserEmail}`);
  
  try {
    // Step 1: Check if user can sign in
    console.log('\nAttempting to sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });
    
    if (signInError) {
      console.error('❌ Sign-in failed:', signInError.message);
      
      // Check if user needs email verification
      if (signInError.message.includes('Email not confirmed')) {
        console.log('\n🔍 User exists but email is not verified.');
        console.log('Please check your email inbox for a verification link from Supabase.');
        console.log('You can also verify the user manually in the Supabase dashboard:');
        console.log('1. Go to Authentication > Users');
        console.log('2. Find the user');
        console.log('3. Click on "..." > "Verify email"');
      }
    } else {
      console.log('✅ Sign-in successful!');
      console.log('User session:', signInData.session ? 'Active' : 'None');
    }
    
    // Step 2: Check if profile exists in the database
    console.log('\nChecking if profile exists...');
    
    // Try querying as an authenticated user
    if (signInData?.session) {
      // Set the session for subsequent requests
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testUserEmail)
        .single();
        
      if (profileError) {
        console.error('❌ Error checking profile:', profileError.message);
        
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found in database.');
          console.log('\nYou may need to create the profile manually with SQL:');
          console.log(`
INSERT INTO profiles ("userId", email, "firstName", "lastName", role)
VALUES 
  ('${signInData.user.id}', '${testUserEmail}', 'Test', 'User', 'CUSTOMER');
          `);
        }
      } else {
        console.log('✅ Profile found:', profile);
      }
    } else {
      // If we couldn't sign in, try a public query with the service key
      console.log('Cannot check profile - unable to authenticate');
    }
    
  } catch (err) {
    console.error('❌ Error verifying user:', err.message);
  }
}

// Execute the function
verifyUser(); 