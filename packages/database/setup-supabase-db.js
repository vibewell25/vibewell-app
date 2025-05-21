#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Helper to read SQL files
const readSqlFile = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

// Interactive CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function executeQuery(query, description) {
  console.log(`Executing: ${description}...`);
  
  try {
    const { error } = await supabase.rpc('pgmoon_exec', { query_text: query });
    
    if (error) {
      console.error(`Error executing ${description}:`, error);
      return false;
    }
    
    console.log(`✅ ${description} executed successfully`);
    return true;
  } catch (err) {
    console.error(`Error executing ${description}:`, err.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up VibeWell database in Supabase...');
  
  // Make sure the pgmoon_exec function exists
  try {
    const { error } = await supabase.rpc('check_if_function_exists', { function_name: 'pgmoon_exec' });
    
    if (error) {
      console.log('Creating the pgmoon_exec function for executing SQL...');
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION pgmoon_exec(query_text text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query_text;
        END;
        $$;
      `;
      
      const { error: funcError } = await supabase.sql(createFunctionSql);
      if (funcError) {
        console.error('Error creating pgmoon_exec function:', funcError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error checking for pgmoon_exec function:', err.message);
    console.log('Creating the check_if_function_exists function...');
    
    const createCheckFunctionSql = `
      CREATE OR REPLACE FUNCTION check_if_function_exists(function_name text)
      RETURNS boolean
      LANGUAGE plpgsql
      AS $$
      DECLARE
        func_exists boolean;
      BEGIN
        SELECT EXISTS (
          SELECT 1
          FROM pg_proc 
          WHERE proname = function_name
        ) INTO func_exists;
        
        RETURN func_exists;
      END;
      $$;
    `;
    
    const { error: checkFuncError } = await supabase.sql(createCheckFunctionSql);
    if (checkFuncError) {
      console.error('Error creating check_if_function_exists function:', checkFuncError);
      
      // Try direct execution of pgmoon_exec
      console.log('Creating the pgmoon_exec function directly...');
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION pgmoon_exec(query_text text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query_text;
        END;
        $$;
      `;
      
      const { error: funcError } = await supabase.sql(createFunctionSql);
      if (funcError) {
        console.error('Error creating pgmoon_exec function:', funcError);
        console.log('\nPlease execute the SQL files manually in the Supabase Dashboard SQL Editor:');
        console.log('1. supabase-create-tables.sql');
        console.log('2. supabase-rls-policies.sql');
        process.exit(1);
      }
    }
  }

  // Read SQL files
  const createTablesSql = readSqlFile('supabase-create-tables.sql');
  const rlsPoliciesSql = readSqlFile('supabase-rls-policies.sql');

  console.log('\n1. Creating database tables...');
  rl.question('Do you want to proceed with creating tables? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      const tablesSuccess = await executeQuery(createTablesSql, 'Table creation');
      
      if (tablesSuccess) {
        console.log('\n2. Setting up Row Level Security policies...');
        rl.question('Do you want to proceed with setting up RLS policies? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            const rlsSuccess = await executeQuery(rlsPoliciesSql, 'RLS policies');
            
            if (rlsSuccess) {
              console.log('\n✅ Database setup completed successfully!');
            }
            rl.close();
          } else {
            console.log('Skipping RLS policies setup.');
            rl.close();
          }
        });
      } else {
        rl.close();
      }
    } else {
      console.log('Database setup cancelled.');
      rl.close();
    }
  });
}

// Start the setup process
setupDatabase(); 