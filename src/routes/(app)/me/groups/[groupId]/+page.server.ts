import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	editGroup,
	getLinksInGroup,
	getUserGroupById,
	insertLinkIntoGroup,
	deleteLinkFromGroup,
	updateLinkInGroup
} from '$lib/server/database/handlers/group';
import {
	groupUpdateSchema,
	linksToGroupsInsertSchema,
	linksToGroupsUpdateSchema
} from '$lib/server/database/schema/group';
import { getAllUserLinks } from '$lib/server/database/handlers/links';
import { z } from 'zod';

export const load = (async ({ locals, params }) => {
	const session = await locals.auth.validate();

	if (!session) error(401, 'unauthorized');

	const [group, linksInGroup, allLinks] = await Promise.all([
		getUserGroupById(session.user.id, params.groupId),
		getLinksInGroup(params.groupId),
		getAllUserLinks(session.user.id)
	]);

	return {
		group,
		linksInGroup,
		allLinks
	};
}) satisfies PageServerLoad;

export const actions = {
	edit_group: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) error(401, 'unauthorized');

		const raw = Object.fromEntries(await request.formData());

		const body = groupUpdateSchema.safeParse(raw);
		if (!body.success) {
			error(400, body.error.message);
		}

		await editGroup(params.groupId, body.data);
	},

	add_group_link: async ({ locals, request, params }) => {
		const session = await locals.auth.validate();
		if (!session) error(401, 'unauthorized');

		const raw = Object.fromEntries(await request.formData());

		const body = linksToGroupsInsertSchema.omit({ groupId: true }).safeParse(raw);
		if (!body.success) error(400, body.error.message);

		await insertLinkIntoGroup({
			groupId: params.groupId,
			linkId: body.data.linkId,
			name: body.data.name
		});
	},

	edit_group_link: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) error(401, 'unauthorized');

		const raw = Object.fromEntries(await request.formData());

		const body = linksToGroupsUpdateSchema.extend({ itemId: z.string() }).safeParse(raw);
		if (!body.success) error(400, body.error.message);

		try {
			await updateLinkInGroup(body.data.itemId, body.data);
		} catch (err) {
			console.log(err);
		}
	},

	delete_group_link: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) error(401, 'unauthorized');

		const raw = Object.fromEntries(await request.formData());

		const body = z.object({ id: z.string() }).safeParse(raw);
		if (!body.success) error(400, body.error.message);

		await deleteLinkFromGroup(body.data.id);
	}
};
