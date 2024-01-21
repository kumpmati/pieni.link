import { db } from '$lib/server/database';
import { links } from '$lib/server/database/schema/link';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		links: await db.select().from(links).where(eq(links.userId, session?.user.id))
	};
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ locals, request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		if (!(await locals.auth.validate())) {
			error(401, 'unauthorized');
		}

		await db.delete(links).where(eq(links.id, id));
	}
};
