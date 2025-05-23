#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Supabase credentials
const supabaseUrl = 'https://ztwvbrlefyppeyabtccr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3ZicmxlZnlwcGV5YWJ0Y2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg2MDk2MiwiZXhwIjoyMDYzNDM2OTYyfQ.AwxoUl04lFNRMc3pgieVux9yYnPNTVjs9DnETv562A8';

async function executeSql(sqlContent) {
  try {
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/rpc/pg_exec`,
      { query: sqlContent },
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response ? error.response.data : error.message 
    };
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node execute-sql.js <sql-file>');
    process.exit(1);
  }

  const sqlFile = process.argv[2];
  const sqlPath = path.resolve(__dirname, sqlFile);
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`File not found: ${sqlPath}`);
    process.exit(1);
  }
  
  console.log(`Executing SQL file: ${sqlFile}`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  const result = await executeSql(sqlContent);
  
  if (result.success) {
    console.log('✅ SQL executed successfully');
    console.log(result.data);
  } else {
    console.error('❌ Error executing SQL:');
    console.error(result.error);
  }
}

main().catch(console.error);
