#!/usr/bin/env node

// Load dotenv directly with an absolute path
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables with an explicit path
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Helper to read SQL files
const readSqlFile = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set');
  
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
    
    // Recommend using service role key
    console.error('\n⚠️ Note: To fix RLS policies, you need SUPABASE_SERVICE_ROLE_KEY with admin privileges.');
    console.error('The anon key does not have permissions to modify database policies.');
  }
  
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function executeSQL(sqlContent) {
  try {
    // Directly execute the SQL statements
    const { error } = await supabase.sql(sqlContent);
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      if (error.message?.includes('permission denied')) {
        console.error('\n⚠️ Permission denied. Make sure you are using the SUPABASE_SERVICE_ROLE_KEY.');
        console.error('The anon key does not have permissions to modify database policies.');
      }
      
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error executing SQL:', err.message);
    
    // Try using rpc if direct SQL execution fails
    try {
      console.log('Trying with RPC method...');
      const { error } = await supabase.rpc('pgmoon_exec', { query_text: sqlContent });
      
      if (error) {
        console.error('Error with RPC method:', error);
        
        if (error.message?.includes('permission denied') || error.message?.includes('does not exist')) {
          console.error('\n⚠️ The pgmoon_exec function may not exist or you lack permissions.');
          console.error('You will need to execute the SQL manually in the Supabase Dashboard.');
        }
        
        return false;
      }
      
      return true;
    } catch (rpcErr) {
      console.error('Error with RPC method:', rpcErr.message);
      return false;
    }
  }
}

async function fixRLSRecursion() {
  console.log('🔧 Applying fix for RLS recursion issue in profiles table...');
  
  // Read SQL fix
  const fixSql = readSqlFile('migrations/20240510000000_fix_profile_rls_recursion.sql');
  
  console.log('Executing SQL fix...');
  const success = await executeSQL(fixSql);
  
  if (success) {
    console.log('✅ Successfully fixed RLS recursion issue!');
  } else {
    console.error('❌ Failed to fix RLS recursion issue.');
    console.log('\nPlease execute this SQL file manually in the Supabase Dashboard SQL Editor:');
    console.log('migrations/20240510000000_fix_profile_rls_recursion.sql');
    
    // Print out the SQL for easy copying
    console.log('\nSQL to run in Supabase Dashboard:');
    console.log('--------------------------------');
    console.log(fixSql);
    console.log('--------------------------------');
  }
}

// Run the fix
fixRLSRecursion(); 