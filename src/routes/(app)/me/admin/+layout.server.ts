import { logger } from '$lib/server/logger/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		error(401, 'unauthorized');
	}

	logger.info(`Admin panel accessed by user ${locals.user.id} (${locals.user.name})`);

	return {};
};
