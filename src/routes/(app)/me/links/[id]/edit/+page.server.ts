import { db } from '$lib/server/database/index.js';
import { linkUpdateSchema, links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request, params }) => {
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
	}
};
