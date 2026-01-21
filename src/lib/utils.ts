import { PUBLIC_BASEURL } from '$env/static/public';
import dayjs from 'dayjs';
import type { Timeframes } from '$lib/constants';
import type { Link } from './server/database/schema/link';

export const getFullURL = (l: Link): string => {
	return `${PUBLIC_BASEURL}/${l.id}`;
};

export const timeframeToDateRange = (t: Timeframes): [Date, Date] => {
	switch (t) {
		case '12mon': {
			return [dayjs().subtract(12, 'months').startOf('day').toDate(), new Date()];
		}

		case '6mon': {
			return [dayjs().subtract(6, 'months').startOf('day').toDate(), new Date()];
		}

		case '1mon': {
			return [dayjs().subtract(1, 'month').startOf('day').toDate(), new Date()];
		}

		case '7d': {
			return [dayjs().subtract(7, 'days').startOf('day').toDate(), new Date()];
		}

		case 'today': {
			return [dayjs().startOf('day').toDate(), new Date()];
		}

		default: {
			return [new Date(), new Date()];
		}
	}
};

export const daysBetween = (dateRange: [Date, Date]): number => {
	return dayjs(dateRange[1]).diff(dateRange[0], 'days');
};

export const formatVisitsPerDay = (total: number, dateRange: [Date, Date]): string => {
	const days = Math.max(daysBetween(dateRange), 1); // at least one day
	const perDay = total / days;

	if (perDay < 1.0) {
		return `< 1`;
	}

	return `~${Math.round(perDay)}`;
};

export const formatAmount = (amount: number): string => {
	return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(amount).toLowerCase();
};
