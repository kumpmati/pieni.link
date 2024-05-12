import { getUserCounts } from '$lib/server/database/handlers/dashboard.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		session,
		counts: getUserCounts(session.user)
	};
};
