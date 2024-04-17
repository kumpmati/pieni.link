import { eq } from 'drizzle-orm';
import { db } from '..';
import { apiKey, type ApiKey } from '../schema/api';

export const getApiKeyBySecret = async (secret: string): Promise<ApiKey | null> => {
	const rows = await db.select().from(apiKey).where(eq(apiKey.secret, secret)).limit(1);
	return rows?.[0] ?? null;
};

export const getUserApiKeys = async (userId: string): Promise<ApiKey[]> => {
	return db.select().from(apiKey).where(eq(apiKey.userId, userId));
};
