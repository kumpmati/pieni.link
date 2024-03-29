import postgres from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

export const pool = new postgres.Pool({ connectionString: DATABASE_URL });

export const db = drizzle(pool);
