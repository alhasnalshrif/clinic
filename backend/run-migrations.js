#!/usr/bin/env node

/**
 * Run database migrations
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');
const MIGRATION_DIR = path.join(__dirname, 'drizzle');

console.log('🔄 Running database migrations...\n');

try {
  // Open database
  const db = new Database(DB_PATH);
  
  // Get all migration files
  const migrationFiles = fs.readdirSync(MIGRATION_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure they run in order
  
  console.log(`📁 Found ${migrationFiles.length} migration file(s)\n`);
  
  migrationFiles.forEach((file) => {
    console.log(`\n📝 Running migration: ${file}`);
    const migrationPath = path.join(MIGRATION_DIR, file);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by statement-breakpoint or semicolons
    const statements = migrationSQL
      .split(/-->.*\n|;/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} statement(s)`);
    
    // Execute each statement
    statements.forEach((statement, index) => {
      try {
        db.exec(statement);
        console.log(`   ✅ Statement ${index + 1} executed successfully`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Statement ${index + 1} - Already exists, skipping`);
        } else {
          throw error;
        }
      }
    });
  });
  
  db.close();
  
  console.log('\n✅ All migrations completed successfully!');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
