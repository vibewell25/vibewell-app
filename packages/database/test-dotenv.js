#!/usr/bin/env node

// First print current process.env values
console.log('Before loading dotenv:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[PRESENT]' : '[MISSING]');

// Load dotenv
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// First, check if .env file exists
const envPath = path.resolve(__dirname, '../../.env');
console.log('\nChecking .env file at:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  // Read file contents
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\nFile content preview (first line only):');
  
  // Print just the first line for security
  const firstLine = envContent.split('\n')[0];
  console.log(firstLine);
  
  // Count lines with content
  const contentLines = envContent.split('\n').filter(line => 
    line.trim() && !line.trim().startsWith('#')
  ).length;
  console.log(`File has ${contentLines} non-comment/non-empty lines`);
}

// Try loading with dotenv directly
console.log('\nTrying to load with dotenv.config():');
const result = dotenv.config({ path: envPath });
console.log('Dotenv loading result:', result.error ? `Error: ${result.error.message}` : 'Success');

// Print loaded values
console.log('\nAfter loading dotenv:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[PRESENT]' : '[MISSING]');

// Try loading with dotenv by dirname
console.log('\nTrying with path from __dirname:');
const result2 = dotenv.config({ path: path.join(__dirname, '../../.env') });
console.log('Dotenv loading result:', result2.error ? `Error: ${result2.error.message}` : 'Success');

// Print loaded values again
console.log('\nAfter second attempt:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[PRESENT]' : '[MISSING]'); 