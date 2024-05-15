import { auth } from '$lib/server/auth/lucia';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		error(401);
	}

	await auth.invalidateSession(locals.session.sessionId);
	locals.auth.setSession(null);

	redirect(302, '/');
};
