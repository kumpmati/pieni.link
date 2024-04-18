import { deleteLink, getUserLink, updateUserLink } from '$lib/server/database/handlers/links.js';
import { linkUpdateSchema } from '$lib/server/database/schema/link.js';
import { error, json } from '@sveltejs/kit';
import { fromZodError } from 'zod-validation-error';

/**
 * GET /api/links/[id]
 */
export const GET = async ({ locals, params }) => {
	return json(await getUserLink(params.id, locals.apiKey.userId));
};

/**
 * PATCH /api/links/[id]
 */
export const PATCH = async ({ request, params, locals }) => {
	const parsed = linkUpdateSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		error(400, fromZodError(parsed.error));
	}

	const updated = await updateUserLink(params.id, locals.apiKey.userId, parsed.data);

	return json(updated);
};

/**
 * DELETE /api/links/[id]
 */
export const DELETE = async ({ params }) => {
	await deleteLink(params.id); // TODO: make sure user owns the link
	return new Response(null, { status: 200 });
};
