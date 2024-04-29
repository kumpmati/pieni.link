import build from 'pino-abstract-transport';
import { log } from '../database/schema/log';
import { db } from '../database';

export default function () {
	return build(async function (source) {
		for await (const obj of source) {
			await db.insert(log).values({
				level: obj.level,
				message: obj.msg,
				timestamp: new Date(obj.time)
			});
		}
	});
}
