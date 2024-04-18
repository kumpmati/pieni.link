import { getAllUserLinks, insertLink } from '$lib/server/database/handlers/links.js';
import { linkInsertSchema } from '$lib/server/database/schema/link.js';
import { error, json } from '@sveltejs/kit';
import { fromZodError } from 'zod-validation-error';

/**
 * GET /api/links
 */
export const GET = async ({ locals }) => {
	return json(await getAllUserLinks(locals.apiKey.userId));
};

/**
 * POST /api/links
 */
export const POST = async ({ locals, request }) => {
	const body = linkInsertSchema
		.omit({ userId: true })
		.safeParse(await request.json().catch(() => null));

	if (!body.success) {
		error(400, fromZodError(body.error).message);
	}

	const link = await insertLink({ ...body.data, userId: locals.apiKey.userId });

	return json(link, { status: 201 });
};
