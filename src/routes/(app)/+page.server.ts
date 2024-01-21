import { db } from '$lib/server/database/index.js';
import { linkInsertSchema, links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			redirect(302, '/auth/signin');
		}

		const raw = Object.fromEntries(await request.formData());

		const body = linkInsertSchema.safeParse({ ...raw, userId: session.user.id });
		if (!body.success) {
			error(400, body.error.message);
		}

		const result = await db.insert(links).values(body.data).returning();

		if (result.length === 0) {
			error(500, 'failed to create link');
		}

		return result[0];
	}
};
