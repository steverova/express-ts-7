// drizzle.config.mysql.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/mysql/index.ts',
  out: './drizzle/mysql',
  dialect: 'mysql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});