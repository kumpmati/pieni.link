import { getAllSignupTokens } from '$lib/server/database/handlers/signupToken';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		invites: await getAllSignupTokens()
	};
}) satisfies PageServerLoad;
