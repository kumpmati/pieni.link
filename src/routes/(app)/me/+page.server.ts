import { db } from '$lib/server/database';
import { links } from '$lib/server/database/schema/link';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { user } from '$lib/server/database/schema/auth';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (!session) {
		error(401, 'unauthorized');
	}

	return {
		links: await db
			.select()
			.from(links)
			.where(eq(links.userId, session?.user.id))
			.orderBy(desc(links.createdAt))
	};
}) satisfies PageServerLoad;

export const actions = {
	delete_link: async ({ locals, request }) => {
		const id = (await request.formData()).get('id')?.toString() ?? null;

		if (!id) {
			error(400, 'missing id');
		}

		if (!(await locals.auth.validate())) {
			error(401, 'unauthorized');
		}

		await db.delete(links).where(eq(links.id, id));
	},

	delete_account: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			error(401, 'unauthorized');
		}

		await db.delete(user).where(eq(user.id, session.user.id));
		locals.auth.invalidate();

		redirect(302, '/');
	}
};
