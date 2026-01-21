import { and, eq, gt, isNull, or } from 'drizzle-orm';
import { db } from '..';
import { links, type Link } from '../schema/link';
import { error } from '@sveltejs/kit';

/**
 * Finds the given link and updates its 'last used' field
 */
export const consumeLink = async (linkId: Link['id']) => {
	const rows = await db
		.update(links)
		.set({ lastUsed: new Date() })
		.where(
			and(eq(links.id, linkId), or(gt(links.validUntil, new Date()), isNull(links.validUntil)))
		)
		.returning();

	if (rows.length === 0) {
		error(404, 'not found');
	}

	return rows[0];
};
