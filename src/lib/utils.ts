import { PUBLIC_BASEURL } from '$env/static/public';
import dayjs from 'dayjs';
import type { Timeframes } from './components/TimeframeTags.svelte';
import type { Link } from './server/database/schema/link';

export const getFullURL = (l: Link): string => {
	return `${PUBLIC_BASEURL}/${l.id}`;
};

export const timeframeToDateRange = (t: Timeframes): [Date, Date] => {
	switch (t) {
		case 'all-time': {
			return [new Date('1970-01-01'), dayjs().endOf('day').toDate()];
		}

		case '30d': {
			return [dayjs().subtract(30, 'days').startOf('day').toDate(), dayjs().endOf('day').toDate()];
		}

		case '7d': {
			return [dayjs().subtract(7, 'days').startOf('day').toDate(), dayjs().endOf('day').toDate()];
		}

		case 'today': {
			return [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()];
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
