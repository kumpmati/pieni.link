import { db } from '$lib/server/database';
import { links } from '$lib/server/database/schema/link';

export const load = async () => {
	return {
		links: await db.select().from(links)
	};
};
