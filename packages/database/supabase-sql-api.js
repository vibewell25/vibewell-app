#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

// Create output directory for SQL files
const outputDir = path.resolve(__dirname, 'sql-migrations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Read SQL file
const sqlFilePath = path.resolve(__dirname, '../../run_all_missing_tables.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL into statements
const statements = sql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

// Group statements by table/function
const tableGroups = {};
let currentGroup = 'setup';
let groupIndex = 1;

statements.forEach((stmt) => {
  // Extract table name or group name
  let groupName = currentGroup;
  
  if (stmt.includes('CREATE TABLE IF NOT EXISTS')) {
    const matches = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
    if (matches && matches[1]) {
      groupName = matches[1];
      currentGroup = groupName;
    }
  } else if (stmt.includes('CREATE OR REPLACE FUNCTION')) {
    groupName = 'functions';
    currentGroup = 'functions';
  } else if (stmt.includes('CREATE TRIGGER')) {
    groupName = 'triggers';
    currentGroup = 'triggers';
  } else if (stmt.includes('CREATE INDEX')) {
    groupName = 'indexes';
    currentGroup = 'indexes';
  } else if (stmt.includes('ALTER TABLE') && stmt.includes('ENABLE ROW LEVEL SECURITY')) {
    groupName = 'rls';
    currentGroup = 'rls';
  } else if (stmt.includes('CREATE POLICY')) {
    groupName = 'policies';
    currentGroup = 'policies';
  }
  
  if (!tableGroups[groupName]) {
    tableGroups[groupName] = [];
  }
  
  tableGroups[groupName].push(stmt);
});

// Write each group to a separate file
Object.entries(tableGroups).forEach(([groupName, stmts]) => {
  const fileName = `${String(groupIndex).padStart(2, '0')}-${groupName}.sql`;
  const filePath = path.join(outputDir, fileName);
  
  const fileContent = stmts.join(';\n\n') + ';';
  fs.writeFileSync(filePath, fileContent);
  
  console.log(`Created ${fileName} with ${stmts.length} statements`);
  groupIndex++;
});

console.log(`\nGenerated ${Object.keys(tableGroups).length} SQL files in ${outputDir}`);
console.log('You can now run these files individually in the Supabase SQL Editor');

// Create a README file with instructions
const readmePath = path.join(outputDir, 'README.md');
const readmeContent = `# SQL Migration Files for VibeWell

These SQL files contain the necessary statements to create the missing tables and set up RLS policies for the VibeWell application.

## How to Use

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Execute the SQL files in numerical order (they are prefixed with numbers)
4. Start with the function definitions (usually 01-functions.sql)
5. Then create tables, indexes, and finally RLS policies

## Important Notes

- Make sure to execute the files in order
- Some statements might fail if the tables already exist or if there are dependency issues
- You may need to modify the SQL statements if you encounter errors

## Files Overview

${Object.entries(tableGroups).map(([name, stmts], index) => 
  `${String(index + 1).padStart(2, '0')}-${name}.sql: ${stmts.length} statements`
).join('\n')}

`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`Created README.md with instructions in ${outputDir}`);

// Create a helper script to execute the SQL files through the Supabase REST API
const helperScriptPath = path.join(outputDir, 'execute-sql.js');
const helperScriptContent = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Supabase credentials
const supabaseUrl = '${supabaseUrl}';
const supabaseKey = '${supabaseKey}';

async function executeSql(sqlContent) {
  try {
    const response = await axios.post(
      \`\${supabaseUrl}/rest/v1/rpc/pg_exec\`,
      { query: sqlContent },
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': \`Bearer \${supabaseKey}\`,
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
    console.error(\`File not found: \${sqlPath}\`);
    process.exit(1);
  }
  
  console.log(\`Executing SQL file: \${sqlFile}\`);
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
`;

fs.writeFileSync(helperScriptPath, helperScriptContent);
fs.chmodSync(helperScriptPath, '755'); // Make it executable
console.log(`Created execute-sql.js helper script in ${outputDir}`);

console.log('\nTo execute a SQL file, run:');
console.log(`cd ${outputDir} && node execute-sql.js 01-functions.sql`);

// Create a batch script to execute all SQL files in order
const batchScriptPath = path.join(outputDir, 'execute-all.js');
const batchScriptContent = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all SQL files in the directory
const sqlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log('Will execute the following SQL files in order:');
sqlFiles.forEach(file => console.log(file));

// Execute each file in order
for (const file of sqlFiles) {
  console.log(\`\\n========== Executing \${file} ==========\`);
  try {
    execSync(\`node \${path.join(__dirname, 'execute-sql.js')} \${file}\`, { stdio: 'inherit' });
    console.log(\`✅ Successfully executed \${file}\`);
  } catch (error) {
    console.error(\`❌ Error executing \${file}\`);
    console.error('Continuing to the next file...');
  }
}

console.log('\\n✅ Finished executing all SQL files');
`;

fs.writeFileSync(batchScriptPath, batchScriptContent);
fs.chmodSync(batchScriptPath, '755'); // Make it executable
console.log(`Created execute-all.js batch script in ${outputDir}`);

console.log('\nTo execute all SQL files in order, run:');
console.log(`cd ${outputDir} && node execute-all.js`); 