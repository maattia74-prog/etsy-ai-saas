import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  if (!cachedDb) {
    const sql = neon(process.env.DATABASE_URL);
    cachedDb = drizzle(sql, { schema });
  }
  
  return cachedDb;
}

// Export the database instance directly
export const db = new Proxy(
  {},
  {
    get: (target, prop) => {
      const database = getDb();
      return (database as any)[prop];
    },
  }
) as ReturnType<typeof drizzle>;

export type Database = ReturnType<typeof drizzle>;
export * from './schema';
