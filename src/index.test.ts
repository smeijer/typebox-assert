import assert from 'node:assert/strict';
import test from 'node:test';

import { Type } from '@sinclair/typebox';

import { assertType } from './index.js';

const User = Type.Object(
	{
		name: Type.String(),
		email: Type.String(),
	},
	{
		$id: 'User',
	},
);

await test('throws AssertionError when props are missing', () => {
	assert.throws(() => assertType(User, { name: 'stephan' }), {
		name: 'AssertionError',
		message: 'Invalid data provided for type: User.',
	});
});

await test('throws no error when all props are valid', () => {
	assert.doesNotThrow(() => assertType(User, { name: 'stephan', email: 'stephan@example.com' }));
});

await test('does not return a value', () => {
	const result = assertType(User, {
		name: 'stephan',
		email: 'stephan@example.com',
	});
	assert.strictEqual(result, void 0);
});

await test('narrows the type', () => {
	const data = { name: 'stephan', email: 'stephan@example.com' } as unknown;
	assertType(User, data);
	// TS would throw here if `data` wasn't narrowed to User
	assert.strictEqual(data.name, 'stephan');
	assert.strictEqual(data.email, 'stephan@example.com');
});
