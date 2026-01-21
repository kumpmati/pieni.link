/**
 * These are all the top-level routes that pieni.link has, and cannot therefore be used as link IDs.
 */
export const RESERVED_LINK_IDS = ['about', 'l', 'api', 'auth'];

export const TIMEFRAMES = [
	{ value: '12mon', label: '12 Months' },
	{ value: '6mon', label: '6 Months' },
	{ value: '1mon', label: '30 Days' },
	{ value: '7d', label: '7 Days' },
	{ value: 'today', label: 'Today' }
] as const;

export type Timeframes = (typeof TIMEFRAMES)[number]['value'];
