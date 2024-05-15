import { deleteLink, getAllLinks } from '$lib/server/database/handlers/links';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load = (async () => {
	return {
		links: await getAllLinks()
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		if (!locals.user) error(401, 'unauthorized');
		if (locals.user.role !== 'admin') error(403, 'forbidden');

		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		await deleteLink(id);

		logger.info(`Link ${id} deleted by user ${locals.user.id} (${locals.user.name})`);
	}
};
