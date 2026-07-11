// drizzle.config.sqlite.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/sqlite/index.ts',
  out: './drizzle/sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.SQLITE_PATH ?? './local.db',
  },
});