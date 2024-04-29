import { getAllLinks } from '$lib/server/database/handlers/links.js';
import { getAllSignupTokens } from '$lib/server/database/handlers/signupToken.js';
import { getAllUsers } from '$lib/server/database/handlers/user.js';
import { logger } from '$lib/server/logger/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session || session.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	const [users, allLinks, allInvites] = await Promise.all([
		getAllUsers(),
		getAllLinks(),
		getAllSignupTokens()
	]);

	logger.info(`Admin panel accessed by user ${session.user.id} (${session.user.name})`);

	return {
		users,
		links: allLinks,
		invites: allInvites
	};
};
