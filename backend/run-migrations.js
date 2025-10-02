#!/usr/bin/env node

/**
 * Run database migrations
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');
const MIGRATION_FILE = path.join(__dirname, 'drizzle', '0001_add_medical_history_sms.sql');

console.log('🔄 Running database migrations...\n');

try {
  // Open database
  const db = new Database(DB_PATH);
  
  // Read migration file
  const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf8');
  
  // Split by semicolons and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log(`📝 Found ${statements.length} migration statements\n`);
  
  // Execute each statement
  statements.forEach((statement, index) => {
    try {
      db.exec(statement);
      console.log(`✅ Statement ${index + 1} executed successfully`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`⚠️  Statement ${index + 1} - Table already exists, skipping`);
      } else {
        throw error;
      }
    }
  });
  
  db.close();
  
  console.log('\n✅ Migrations completed successfully!');
  console.log('\nNew tables added:');
  console.log('  - medical_history');
  console.log('  - sms_messages');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
