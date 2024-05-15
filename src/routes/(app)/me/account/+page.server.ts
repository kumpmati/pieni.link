import { deleteUser } from '$lib/server/database/handlers/user';
import { logger } from '$lib/server/logger';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	delete_account: async ({ locals }) => {
		if (!locals.user) {
			error(401, 'unauthorized');
		}

		await deleteUser(locals.user.id);
		locals.auth.invalidate();

		logger.warn(`Account deleted: ${locals.user.id} (${locals.user.name})`);

		redirect(302, '/');
	}
};
