import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let cachedDb: any = null;

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

// Export a lazy getter for backward compatibility
export const db = new Proxy({}, {
  get: (target, prop) => {
    return getDb()[prop as string];
  },
}) as any;

export type Database = any;
export * from './schema';
