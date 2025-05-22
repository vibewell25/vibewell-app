#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the .env file
const envPath = path.resolve(__dirname, '../.env');

// Check if .env file exists
const envExists = fs.existsSync(envPath);

// Template for the .env file (using explicit format with no spaces around =)
const envTemplate = `# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=__SUPABASE_URL__
NEXT_PUBLIC_SUPABASE_ANON_KEY=__SUPABASE_ANON_KEY__
SUPABASE_SERVICE_ROLE_KEY=__SUPABASE_SERVICE_ROLE_KEY__

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Format URL values correctly (trim and ensure no spaces)
function formatValue(value) {
  return value.trim();
}

// Main function
async function setupEnv() {
  console.log('🔧 Setting up environment variables for VibeWell\n');
  
  if (envExists) {
    console.log('An .env file already exists at the project root.');
    const overwrite = await prompt('Do you want to update it? (y/n): ');
    
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Exiting without changes.');
      rl.close();
      return;
    }
  }
  
  console.log('\nPlease enter your Supabase credentials from the Supabase dashboard.');
  console.log('You can find these at https://app.supabase.com/ → Project Settings → API\n');
  
  // Get Supabase URL
  const supabaseUrl = await prompt('Supabase URL: ');
  
  // Get Supabase anon key
  const supabaseAnonKey = await prompt('Supabase Anon Key: ');
  
  // Get Supabase service role key
  console.log('\n⚠️ The Service Role Key has admin privileges and is required to fix RLS issues.');
  const supabaseServiceRoleKey = await prompt('Supabase Service Role Key: ');
  
  // Create the .env content with proper formatting
  let envContent = envTemplate
    .replace('__SUPABASE_URL__', formatValue(supabaseUrl))
    .replace('__SUPABASE_ANON_KEY__', formatValue(supabaseAnonKey))
    .replace('__SUPABASE_SERVICE_ROLE_KEY__', formatValue(supabaseServiceRoleKey));
  
  // Make sure we use Unix line endings
  envContent = envContent.replace(/\r\n/g, '\n');
  
  // Write to .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment variables have been set up successfully!');
  console.log('\nTesting variables...');
  
  // Verify the file was written correctly
  try {
    const written = fs.readFileSync(envPath, 'utf8');
    const hasUrl = written.includes(`NEXT_PUBLIC_SUPABASE_URL=${formatValue(supabaseUrl)}`);
    const hasAnonKey = written.includes(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${formatValue(supabaseAnonKey)}`);
    const hasServiceKey = written.includes(`SUPABASE_SERVICE_ROLE_KEY=${formatValue(supabaseServiceRoleKey)}`);
    
    if (hasUrl && hasAnonKey && hasServiceKey) {
      console.log('✅ .env file validation passed!');
    } else {
      console.log('⚠️ Some variables may not have been written correctly.');
    }
  } catch (err) {
    console.error('Error verifying .env file:', err.message);
  }
  
  console.log('\nYou can now run:');
  console.log('  npm run test-supabase     # To test the Supabase connection');
  console.log('  npm run fix-supabase-rls  # To fix RLS recursion issues');
  
  rl.close();
}

// Run the setup
setupEnv(); 