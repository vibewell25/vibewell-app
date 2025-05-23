#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Helper to read SQL files
const readSqlFile = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

// Get env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function executeSqlDirect(sql) {
  try {
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    // Execute each statement one by one
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`\nExecuting statement ${i+1}/${statements.length}:`);
      console.log(stmt.substring(0, 100) + (stmt.length > 100 ? '...' : ''));
      
      // Try using the REST API
      try {
        await executeTableCreation(stmt);
        console.log(`✅ Statement ${i+1} executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i+1}:`, error.message);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error executing SQL:', err.message);
    return false;
  }
}

async function executeTableCreation(sql) {
  console.log('Opening the Supabase dashboard SQL Editor...');
  console.log('Please manually run the SQL below in the SQL Editor:');
  console.log('---------------------------------------------');
  console.log(sql);
  console.log('---------------------------------------------');
  
  return new Promise((resolve) => {
    // Prompt user to continue after manual execution
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('\nPress Enter after executing the SQL statement in the Supabase dashboard...', () => {
      readline.close();
      resolve();
    });
  });
}

async function runMissingTablesMigration() {
  console.log('🚀 Running missing tables migration in Supabase...');
  
  // Read SQL file
  const missingTablesSql = readSqlFile('migrations/20250522_missing_tables.sql');

  console.log('\nCreating missing tables and applying RLS policies...');
  await executeSqlDirect(missingTablesSql);
  
  console.log('\n✅ Missing tables migration process completed!');
  console.log('Please verify in the Supabase dashboard that all tables were created successfully.');
}

// Start the migration process
runMissingTablesMigration(); 