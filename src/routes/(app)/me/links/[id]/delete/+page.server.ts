import { db } from '$lib/server/database/index.js';
import { links } from '$lib/server/database/schema/link.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ params, locals }) => {
		if (!(await locals.auth.validate())) {
			error(401, 'unauthorized');
		}

		await db.delete(links).where(eq(links.id, params.id));

		redirect(302, '/me/links');
	}
};
