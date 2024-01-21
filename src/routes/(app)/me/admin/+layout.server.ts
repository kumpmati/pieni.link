import { db } from '$lib/server/database/index.js';
import { signupToken, user } from '$lib/server/database/schema/auth.js';
import { links } from '$lib/server/database/schema/link.js';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();

	if (!session || session.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	const [users, allLinks, allInvites] = await Promise.all([
		db.select().from(user),
		db.select().from(links),
		db.select().from(signupToken)
	]);

	return {
		users,
		links: allLinks,
		invites: allInvites
	};
};
