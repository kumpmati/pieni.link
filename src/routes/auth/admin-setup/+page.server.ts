import { SIGNUP_TOKEN_COOKIE } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { user, signupToken } from '$lib/server/database/schema/auth';
import { error } from '@sveltejs/kit';
import { count, and, eq, isNull } from 'drizzle-orm';

export const load = async ({ cookies }) => {
	const [row] = await db.select({ num: count() }).from(user); // TODO: optimize?

	if (row.num > 0) {
		return {};
	}

	// since there are no users in the system yet, add a signup token
	const [existing] = await db
		.select()
		.from(signupToken)
		.where(and(eq(signupToken.role, 'admin'), isNull(signupToken.usedAt)));

	if (existing) {
		cookies.set(SIGNUP_TOKEN_COOKIE, existing.id, { path: '/' });
		return {};
	}

	const [newToken] = await db.insert(signupToken).values({ role: 'admin' }).returning();
	if (!newToken) {
		error(500, 'failed to create signup token for first-time setup');
	}

	cookies.set(SIGNUP_TOKEN_COOKIE, newToken.id, { path: '/' });
	return {};
};
