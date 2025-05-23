#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from the backup file
const envPath = path.resolve(__dirname, '../../.env_backup/root.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#\s][^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    envVars[key] = value;
  }
});

// Get Supabase credentials
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env_backup/root.env');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

// Read SQL file
const sqlFilePath = path.resolve(__dirname, '../../run_all_missing_tables.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL into statements
const statements = sql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

async function executeSQL() {
  console.log(`🚀 Running SQL migration with ${statements.length} statements...`);
  
  // Execute statements one by one
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`\nExecuting statement ${i+1}/${statements.length}:`);
    console.log(stmt.substring(0, 100) + (stmt.length > 100 ? '...' : ''));
    
    try {
      // Execute SQL directly using Supabase REST API
      const { data, error } = await supabase.rpc('exec_sql', { sql: stmt });
      
      if (error) {
        // If the exec_sql function doesn't exist, try creating it first
        if (error.message.includes('Could not find the function public.exec_sql')) {
          console.log('The exec_sql function does not exist. Creating it first...');
          
          // Read the SQL function creation script
          const functionSqlPath = path.resolve(__dirname, './create-exec-sql-function.sql');
          const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
          
          // Execute the function creation SQL directly
          const { error: functionError } = await supabase.from('_rpc').select('*').rpc('pg_exec', { 
            query: functionSql 
          });
          
          if (functionError) {
            console.error(`❌ Error creating exec_sql function: ${functionError.message}`);
            console.error('You may need to manually create the function in the Supabase SQL Editor');
            console.log('\nFunction SQL:');
            console.log(functionSql);
            process.exit(1);
          } else {
            console.log('✅ Successfully created exec_sql function');
            
            // Try executing the statement again
            const { error: retryError } = await supabase.rpc('exec_sql', { sql: stmt });
            if (retryError) {
              console.error(`❌ Error executing statement ${i+1}: ${retryError.message}`);
            } else {
              console.log(`✅ Statement ${i+1} executed successfully`);
            }
          }
        } else {
          console.error(`❌ Error executing statement ${i+1}: ${error.message}`);
        }
      } else {
        console.log(`✅ Statement ${i+1} executed successfully`);
      }
    } catch (error) {
      console.error(`❌ Error executing statement ${i+1}: ${error.message}`);
    }
  }
  
  console.log('\n✅ SQL migration process completed!');
}

// Execute the SQL statements
executeSQL(); 