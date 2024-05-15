import { deleteUser, getAllUsers } from '$lib/server/database/handlers/user';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load = (async () => {
	return {
		users: await getAllUsers()
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_account: async ({ locals, request }) => {
		if (!locals.user) error(401, 'unauthorized');
		if (locals.user.role !== 'admin') error(403, 'forbidden');

		const userId = (await request.formData()).get('id')?.toString();

		if (!userId) {
			error(400, 'missing id');
		}

		await deleteUser(userId);

		logger.warn(`Account ${userId} deleted by ${locals.user.id} (${locals.user.name}) `);
	}
};
