import { db } from '$lib/server/database/index.js';
import { signupToken, user } from '$lib/server/database/schema/auth.js';
import { links } from '$lib/server/database/schema/link.js';
import { error } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

export const load = async ({ parent }) => {
	const { session } = await parent();

	if (!session || session.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	const [users, allLinks, allInvites] = await Promise.all([
		db.select().from(user).orderBy(desc(user.name)),
		db.select().from(links).orderBy(desc(links.createdAt)),
		db.select().from(signupToken).orderBy(desc(signupToken.createdAt))
	]);

	return {
		users,
		links: allLinks,
		invites: allInvites
	};
};
