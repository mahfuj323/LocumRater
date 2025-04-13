#!/usr/bin/env node

// This script will apply schema to a production database
// Run with: node db-migrate.js
import { pool, db } from './server/db.js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

console.log('Starting database migration...');

try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  await pool.end();
}