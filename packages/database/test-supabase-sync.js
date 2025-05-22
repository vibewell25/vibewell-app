#!/usr/bin/env node

// Load dotenv directly with an absolute path
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables with an explicit path
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env');
  
  // Check if .env file exists
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.error('\n⚠️ No .env file found at the project root!');
    console.error('Please create a .env file with the following variables:');
    console.error(`
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
    `);
    console.error('\nYou can find these values in your Supabase project dashboard:');
    console.error('1. Go to https://app.supabase.com/');
    console.error('2. Select your project');
    console.error('3. Go to Project Settings > API');
    console.error('4. Copy the URL and keys from there');
  } else {
    console.error('\n⚠️ Found .env file, but Supabase variables are missing or incorrect.');
    console.error('Please check your .env file and ensure it contains the correct values.');
    
    // Debug info
    console.error('\nDebug info:');
    console.error('- .env path:', envPath);
    console.error('- .env exists:', fs.existsSync(envPath));
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n').filter(line => line.trim()).length;
      console.error(`- .env has ${lines} lines`);
      
      // Check for common format issues
      if (envContent.includes('\r')) {
        console.error('- WARNING: .env file contains Windows-style line endings (\\r\\n)');
      }
      
      if (envContent.includes('=http://') || envContent.includes('=https://')) {
        console.error('- WARNING: .env file may have URL format issues (no spaces allowed around =)');
      }
    }
  }
  
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function testConnection() {
  console.log('🔍 Testing Supabase connection and data sync...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Check auth connection
    console.log('\n1. Testing authentication connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      throw authError;
    }
    
    console.log('✅ Successfully connected to Supabase Auth!');
    console.log('Session status:', authData.session ? 'Active session' : 'No active session');
    
    // Test database tables access
    console.log('\n2. Testing database tables access...');
    
    // Try accessing key tables
    const tables = ['profiles', 'categories', 'services', 'bookings', 'reviews'];
    
    for (const table of tables) {
      try {
        console.log(`Testing access to "${table}" table...`);
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.code === '42P01') {
            console.log(`⚠️ Table "${table}" does not exist.`);
          } else if (error.message.includes('permission denied')) {
            console.log(`⚠️ Permission denied for table "${table}". Check RLS policies.`);
          } else {
            console.log(`⚠️ Error accessing "${table}": ${error.message}`);
          }
        } else {
          console.log(`✅ Successfully accessed "${table}" table.`);
          console.log(`   Retrieved ${data.length} rows.`);
        }
      } catch (tableErr) {
        console.error(`❌ Error with "${table}" table:`, tableErr.message);
      }
    }
    
    // Test the profiles table specifically for RLS recursion issues
    console.log('\n3. Testing profiles table for RLS recursion issues...');
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profileError) {
        if (profileError.message.includes('infinite recursion')) {
          console.error('❌ RLS recursion issue detected in profiles table!');
          console.error('Please run: npm run fix-supabase-rls');
        } else {
          console.error('❌ Error accessing profiles:', profileError.message);
        }
      } else {
        console.log('✅ No RLS recursion issues detected in profiles table.');
        console.log(`   Retrieved ${profileData.length} profiles.`);
      }
    } catch (profileErr) {
      console.error('❌ Error testing profiles table:', profileErr.message);
    }
    
    console.log('\n4. Testing data sync capabilities...');
    
    // Try a simple data insertion and retrieval
    try {
      const testId = `test-${Date.now()}`;
      
      // Check if we can create and retrieve data
      const { error: insertError } = await supabase
        .from('categories')
        .insert({ 
          id: testId,
          name: 'Test Category', 
          description: 'Created for sync testing',
          slug: `test-category-${Date.now()}`
        });
      
      if (insertError) {
        if (insertError.message.includes('permission denied')) {
          console.log('⚠️ Cannot test data insertion due to permissions. This is expected if not logged in.');
        } else {
          console.log(`⚠️ Error inserting test data: ${insertError.message}`);
        }
      } else {
        // Check retrieval
        const { data: retrievedData, error: retrieveError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', testId)
          .single();
        
        if (retrieveError) {
          console.log(`⚠️ Error retrieving test data: ${retrieveError.message}`);
        } else {
          console.log('✅ Successfully inserted and retrieved test data!');
          
          // Clean up test data
          await supabase.from('categories').delete().eq('id', testId);
        }
      }
    } catch (syncErr) {
      console.error('❌ Error testing data sync:', syncErr.message);
    }
    
    console.log('\n✨ Supabase connection test completed!');
    
  } catch (err) {
    console.error('❌ Error connecting to Supabase:', err.message);
    process.exit(1);
  }
}

// Run the test
testConnection(); 