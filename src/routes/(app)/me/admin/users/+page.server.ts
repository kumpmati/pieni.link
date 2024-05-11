import { getAllUsers } from '$lib/server/database/handlers/user';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		users: await getAllUsers()
	};
}) satisfies PageServerLoad;
