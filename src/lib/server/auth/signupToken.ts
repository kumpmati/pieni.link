import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../database';
import { signupToken } from '../database/schema/auth';

export const consumeSignupToken = async (
	tokenId: string | undefined
): Promise<'admin' | 'member'> => {
	if (!tokenId || tokenId === '') {
		return 'member';
	}

	const rows = await db
		.update(signupToken)
		.set({ usedAt: new Date() })
		.where(and(eq(signupToken.id, tokenId), isNull(signupToken.usedAt)))
		.returning();

	if (rows.length === 0) {
		return 'member';
	}

	return rows[0].role;
};
