import { LOG_LEVEL } from '$env/static/private';
import { pino } from 'pino';
import pgTransport from './pg-transport';

export const logger = pino({ level: LOG_LEVEL ?? 'warn' }, pgTransport());
