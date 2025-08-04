const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./schema');

// Initialize SQLite database
const sqlite = new Database('./database.db');

// Initialize Drizzle ORM
const db = drizzle(sqlite, { schema });

module.exports = { db, sqlite };