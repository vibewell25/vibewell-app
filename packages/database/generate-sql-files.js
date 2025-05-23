#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = path.resolve(__dirname, '../../run_all_missing_tables.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Create output directory
const outputDir = path.resolve(__dirname, 'sql-migrations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Split SQL into statements
const statements = sql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

// Group statements by table
const tableGroups = {};
let currentGroup = 'setup';
let groupIndex = 1;

statements.forEach((stmt) => {
  // Extract table name or group name
  let groupName = currentGroup;
  
  if (stmt.includes('CREATE TABLE IF NOT EXISTS')) {
    const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
    groupName = tableName;
    currentGroup = tableName;
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