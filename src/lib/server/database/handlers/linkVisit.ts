import { db } from '..';
import { linkVisit } from '../schema/analytics';
import type { Link } from '../schema/link';

/**
 * Creates a new link visit entry, returning true if the visit was successful
 * @param linkId
 * @param request
 * @returns
 */
export const insertLinkVisitFromRequest = async (linkId: Link['id'], request: Request) => {
	const url = new URL(request.url);

	const referrer =
		url.searchParams.get('ref') ??
		request.headers.get('referrer') ??
		request.headers.get('referer') ??
		request.referrer;

	await db.insert(linkVisit).values({
		linkId,
		referrer,
		userAgent: request.headers.get('user-agent') ?? ''
	});
};
