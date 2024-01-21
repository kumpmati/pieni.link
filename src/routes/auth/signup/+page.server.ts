import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SIGNUP_TOKEN_COOKIE } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { signupToken } from '$lib/server/database/schema/auth';
import { and, eq, isNull } from 'drizzle-orm';

export const load = (async ({ url, cookies }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		error(401, 'no signup token provided');
	}

	const rows = await db
		.select()
		.from(signupToken)
		.where(and(eq(signupToken.id, token), isNull(signupToken.usedAt)));

	if (rows.length === 0) {
		error(403, 'invalid signup token');
	}

	cookies.set(SIGNUP_TOKEN_COOKIE, rows[0].id, { path: '/', httpOnly: true, maxAge: 60 * 60 });

	return {};
}) satisfies PageServerLoad;
