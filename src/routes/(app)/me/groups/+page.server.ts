import { getGroupsByUser, insertGroup } from '$lib/server/database/handlers/group';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { groupInsertSchema } from '$lib/server/database/schema/group';
import { nanoid } from 'nanoid';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) error(401, 'unauthorized');

	return {
		groups: await getGroupsByUser(session.user.id)
	};
}) satisfies PageServerLoad;

export const actions = {
	create_group: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) error(401, 'unauthorized');

		const raw = Object.fromEntries(await request.formData());

		const body = groupInsertSchema.safeParse({
			...raw,
			id: nanoid(15),
			userId: session.user.id
		});

		if (!body.success) {
			error(400, body.error.message);
		}

		await insertGroup(body.data);
	}
};
