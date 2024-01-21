import { db } from '$lib/server/database/index.js';
import { linkUpdateSchema, links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	update: async ({ request, params }) => {
		const raw = Object.fromEntries(await request.formData());

		const body = linkUpdateSchema.safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		const [updated] = await db
			.update(links)
			.set(body.data)
			.where(eq(links.id, params.id))
			.returning();
		if (!updated) {
			error(500, 'failed to update link');
		}

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

		redirect(302, '/me');
	}
};
