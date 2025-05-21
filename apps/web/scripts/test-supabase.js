#!/usr/bin/env node

// This script compiles and runs the Supabase connection test

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const testFilePath = path.join(__dirname, '../lib/supabase/test-connection.ts');
const outDir = path.join(__dirname, '../dist');

// Make sure the output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Compile the TypeScript file
console.log('Compiling TypeScript test file...');
exec(`npx tsc ${testFilePath} --outDir ${outDir}`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error compiling TypeScript file:', error);
    return;
  }
  
  if (stderr) {
    console.error('TypeScript compilation errors:', stderr);
    return;
  }
  
  const compiledFile = path.join(outDir, 'lib/supabase/test-connection.js');
  
  // Run the compiled JavaScript
  console.log('Running Supabase connection test...');
  exec(`node -r dotenv/config ${compiledFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error running test:', error);
      return;
    }
    
    if (stderr) {
      console.error('Test errors:', stderr);
    }
    
    console.log(stdout);
  });
}); 