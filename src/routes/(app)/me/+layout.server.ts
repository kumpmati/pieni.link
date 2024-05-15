import { getUserCounts } from '$lib/server/database/handlers/dashboard.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		error(401, 'unauthorized');
	}

	return {
		user: locals.user,
		counts: getUserCounts(locals.user)
	};
};
