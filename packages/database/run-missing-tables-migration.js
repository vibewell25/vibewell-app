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
      
      try {
        // Execute SQL directly using Supabase REST API
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        
        if (error) {
          console.error(`❌ Error executing statement ${i+1}:`, error.message);
        } else {
          console.log(`✅ Statement ${i+1} executed successfully`);
        }
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

async function runMissingTablesMigration() {
  console.log('🚀 Running missing tables migration in Supabase...');
  
  // Read SQL file
  const sqlFilePath = path.resolve(__dirname, '../../run_all_missing_tables.sql');
  const missingTablesSql = fs.readFileSync(sqlFilePath, 'utf8');

  console.log('\nCreating missing tables and applying RLS policies...');
  await executeSqlDirect(missingTablesSql);
  
  console.log('\n✅ Missing tables migration process completed!');
  console.log('Please verify in the Supabase dashboard that all tables were created successfully.');
}

// Start the migration process
runMissingTablesMigration(); 