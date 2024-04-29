import { deleteLink, getAllUserLinks } from '$lib/server/database/handlers/links';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		links: await getAllUserLinks(session.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		await deleteLink(id);

		logger.info(`Link ${id} deleted by user ${session.user.id} (${session.user.name})`);
	}
};
