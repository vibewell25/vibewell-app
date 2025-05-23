#!/usr/bin/env node

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
  console.log(`\n========== Executing ${file} ==========`);
  try {
    execSync(`node ${path.join(__dirname, 'execute-sql.js')} ${file}`, { stdio: 'inherit' });
    console.log(`✅ Successfully executed ${file}`);
  } catch (error) {
    console.error(`❌ Error executing ${file}`);
    console.error('Continuing to the next file...');
  }
}

console.log('\n✅ Finished executing all SQL files');
