import type { LinkVisit } from '$lib/server/database/schema/analytics';
import dayjs from 'dayjs';

export const numVisitsByDay = (visits: LinkVisit[]) => {
	const total: Record<string, number> = {};

	visits.forEach((visit) => {
		const day = dayjs(visit.timestamp).format('YYYY-MM-DD');

		total[day] ??= 0;
		total[day] += 1;
	});

	return Object.keys(total)
		.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
		.map((key) => ({ x: dayjs(key).format('MMM DD'), y: total[key] }));
};

export const download = (filename: string, type: string, data: string) => {
	const link = document.createElement('a');
	link.setAttribute('href', `data:${type};charset=utf-8,${encodeURI(data)}`);
	link.setAttribute('download', filename);

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
