import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.js',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './database.db',
  },
} satisfies Config;