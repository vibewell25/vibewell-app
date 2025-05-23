#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Prisma client
const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Running missing tables migration using Prisma...');
    
    // Read SQL file
    const sqlFilePath = path.resolve(__dirname, '../../run_all_missing_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    // Execute each statement one by one using Prisma's executeRaw
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`\nExecuting statement ${i+1}/${statements.length}:`);
      console.log(stmt.substring(0, 100) + (stmt.length > 100 ? '...' : ''));
      
      try {
        await prisma.$executeRaw`${stmt}`;
        console.log(`✅ Statement ${i+1} executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i+1}:`, error.message);
      }
    }
    
    console.log('\n✅ Missing tables migration process completed!');
    console.log('Please verify in the Supabase dashboard that all tables were created successfully.');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
runMigration(); 