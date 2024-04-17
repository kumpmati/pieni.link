import { deleteLink, getUserLink } from '$lib/server/database/handlers/links.js';
import { error, json } from '@sveltejs/kit';

/**
 * GET /api/links/[id]
 */
export const GET = async ({ locals, params }) => {
	return json(await getUserLink(params.id, locals.apiKey.userId));
};

/**
 * PATCH /api/links/[id]
 */
export const PATCH = async () => {
	return error(501, 'not implemented');
};

/**
 * DELETE /api/links/[id]
 */
export const DELETE = async ({ params }) => {
	await deleteLink(params.id); // TODO: make sure user owns the link
	return new Response(null, { status: 200 });
};
