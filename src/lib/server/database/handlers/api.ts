import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { apiKey, type ApiKey } from '../schema/api';
import { nanoid } from 'nanoid';

export const getApiKeyBySecret = async (secret: string): Promise<ApiKey | null> => {
	const rows = await db.select().from(apiKey).where(eq(apiKey.secret, secret)).limit(1);
	return rows?.[0] ?? null;
};

export const getUserApiKeys = async (userId: string): Promise<Omit<ApiKey, 'secret'>[]> => {
	return db
		.select({ id: apiKey.id, userId: apiKey.userId, createdAt: apiKey.createdAt })
		.from(apiKey)
		.where(eq(apiKey.userId, userId));
};

export const getUserApiKeysUnsafe = async (userId: string): Promise<ApiKey[]> => {
	return db.select().from(apiKey).where(eq(apiKey.userId, userId));
};

export const createUserApiKey = async (userId: string): Promise<ApiKey> => {
	const rows = await db
		.insert(apiKey)
		.values({ userId, id: nanoid(15), secret: nanoid(24) })
		.returning();

	return rows[0];
};

export const deleteUserApiKey = async (keyId: string, userId: string) => {
	await db.delete(apiKey).where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)));
};
