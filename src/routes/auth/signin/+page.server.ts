import { db } from '$lib/server/database';
import { user } from '$lib/server/database/schema/auth';
import { redirect } from '@sveltejs/kit';
import { count } from 'drizzle-orm';

export const load = async () => {
	const [row] = await db.select({ num: count() }).from(user); // TODO: optimize?

	if (row.num > 0) {
		return {};
	}

	redirect(302, '/auth/admin-setup');
};
