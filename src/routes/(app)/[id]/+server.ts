import { insertLinkVisitFromRequest } from '$lib/server/database/handlers/linkVisit.js';
import { consumeLink } from '$lib/server/database/handlers/links.js';
import { logger } from '$lib/server/logger/index.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ params, request }) => {
	const link = await consumeLink(params.id);

	await insertLinkVisitFromRequest(params.id, request);

	logger.info(`Link ${params.id} visited`);

	redirect(302, link.url);
};
