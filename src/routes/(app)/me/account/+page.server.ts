import { deleteUser } from '$lib/server/database/handlers/user';
import { logger } from '$lib/server/logger';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	delete_account: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		await deleteUser(session.user.id);
		locals.auth.invalidate();

		logger.warn(`Account deleted: ${session.user.id} (${session.user.name})`);

		redirect(302, '/');
	}
};
