import { getAllLinks } from '$lib/server/database/handlers/links.js';
import { getAllSignupTokens } from '$lib/server/database/handlers/signupToken.js';
import { getAllUsers } from '$lib/server/database/handlers/user.js';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();

	if (!session || session.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	const [users, allLinks, allInvites] = await Promise.all([
		getAllUsers(),
		getAllLinks(),
		getAllSignupTokens()
	]);

	return {
		users,
		links: allLinks,
		invites: allInvites
	};
};
