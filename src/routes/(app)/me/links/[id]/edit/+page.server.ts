import { RESERVED_LINK_IDS } from '$lib/server/constants';
import { updateUserLink } from '$lib/server/database/handlers/links.js';
import { db } from '$lib/server/database/index.js';
import { linkUpdateSchema, links, type Link } from '$lib/server/database/schema/link.js';
import { logger } from '$lib/server/logger/index.js';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	update: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = linkUpdateSchema.safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		if (body.data.id && RESERVED_LINK_IDS.includes(body.data.id)) {
			error(400, 'cannot use a reserved url as an ID');
		}

		let updated: Link;

		try {
			updated = await updateUserLink(params.id, session.user.id, body.data);
		} catch (err) {
			error(500, err as Error);
		}

		logger.info(
			`Link ${params.id} updated to ${JSON.stringify(updated, null, 2)} by user ${session.user.id} (${session.user.name})`
		);

		redirect(301, `/me/links/${updated.id}/edit`);
	},

	delete: async ({ locals, params }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		const result = await db
			.delete(links)
			.where(and(eq(links.id, params.id), eq(links.userId, session.user.id)));

		if (result.rowCount === 0) {
			error(500, 'failed to delete link');
		}

		logger.info(`Link ${params.id} deleted by user ${session.user.id} (${session.user.name})`);

		redirect(302, '/me');
	}
};
