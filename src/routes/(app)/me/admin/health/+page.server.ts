import {
	DATABASE_PASSWORD,
	DATABASE_URL,
	GOOGLE_OAUTH_ID,
	GOOGLE_OAUTH_SECRET,
	LOG_LEVEL
} from '$env/static/private';
import { PUBLIC_BASEURL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) error(403, 'unauthorized');
	if (session.user.role !== 'admin') error(401, 'forbidden');

	return {
		env: {
			PUBLIC_BASEURL,
			LOG_LEVEL,
			DATABASE_URL: DATABASE_URL ? '*'.repeat(DATABASE_URL.length) : '<empty>',
			DATABASE_PASSWORD: DATABASE_PASSWORD ? '*'.repeat(DATABASE_PASSWORD.length) : '<empty>',
			GOOGLE_OAUTH_ID: GOOGLE_OAUTH_ID ? '*'.repeat(GOOGLE_OAUTH_ID.length) : '<empty>',
			GOOGLE_OAUTH_SECRET: GOOGLE_OAUTH_SECRET ? '*'.repeat(GOOGLE_OAUTH_SECRET.length) : '<empty>'
		}
	};
}) satisfies PageServerLoad;
