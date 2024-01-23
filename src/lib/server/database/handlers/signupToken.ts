import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import { signupToken, type SignupToken } from '../schema/auth';
import { error } from '@sveltejs/kit';

export const getAllSignupTokens = async () => {
	return await db.select().from(signupToken).orderBy(desc(signupToken.createdAt));
};

export const createSignupToken = async (role: 'admin' | 'member') => {
	const rows = await db.insert(signupToken).values({ role }).returning();
	if (rows.length === 0) {
		error(500, 'failed to create signup token');
	}

	return rows[0];
};

export const deleteSignupToken = async (tokenId: SignupToken['id']) => {
	const response = await db.delete(signupToken).where(eq(signupToken.id, tokenId));
	if (response.rowCount === 0) {
		error(500, 'failed to delete signup token');
	}

	return true;
};
