import { linkInsertSchema } from '$lib/server/database/schema/link';
import { nanoid } from 'nanoid';
import { describe, it, expect } from 'vitest';

describe('link insert schema', () => {
	it('id has to be at least 1 length', () => {
		const result = linkInsertSchema.pick({ id: true }).safeParse({ id: '' });
		expect(result.success).toBe(false);
	});

	it('id can only accept a-zA-Z0-9_- characters', () => {
		const correct = new Array(20).fill('a').map(() => nanoid(10)); // nanoid uses same character set

		for (const t of correct) {
			const result = linkInsertSchema.pick({ id: true }).safeParse({ id: t });
			expect(result.success, !result.success ? result.error.message : '').toBe(true);
		}

		const incorrect = ['abc+', 'abc.', 'abc/', 'abc def', '', '.', ' ', '!', '?'];

		for (const t of incorrect) {
			const result = linkInsertSchema.pick({ id: true }).safeParse({ id: t });
			expect(result.success, t).toBe(false);
		}
	});

	it('url has to be non-empty url', () => {
		const result = linkInsertSchema.pick({ url: true }).safeParse({ url: '' });
		expect(result.success).toBe(false);
	});

	it('url has to be non-relative', () => {
		const incorrect = ['./hello', '/hello', 'hello'];

		for (const t of incorrect) {
			const a = linkInsertSchema.pick({ url: true }).safeParse({ url: t });
			expect(a.success, t).toBe(false);
		}
	});
});
