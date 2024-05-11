import { logger } from '$lib/server/logger/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session || session.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	logger.info(`Admin panel accessed by user ${session.user.id} (${session.user.name})`);

	return {};
};
