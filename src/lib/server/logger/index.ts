import { LOG_LEVEL } from '$env/static/private';
import { pino } from 'pino';

export const logger = pino({
	level: LOG_LEVEL ?? 'warn'
});
