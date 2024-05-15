import { Static, TSchema } from '@sinclair/typebox';
import { Mutable, Value, ValueError } from '@sinclair/typebox/value';

export class AssertionError extends Error {
	override name = 'AssertionError';
	override message: string;
	errors: ValueError[];

	constructor(message: string, errors: ValueError[]) {
		super(message);
		this.message = message;
		this.errors = errors;
	}
}

export function assertType<T extends TSchema>(schema: T, value: unknown, message?: string): asserts value is Static<T> {
	if (!schema.$id) throw new Error(`Please provide an '$id' to your typebox schemas`);
	Value.Clean(schema, value);
	Value.Default(schema, value);

	// clean and default mutate, convert does not
	Value.Mutate(value as Mutable, Value.Convert(schema, value) as Mutable);

	if (Value.Check(schema, value)) {
		return;
	}

	const errors = [...Value.Errors(schema, value)];
	if (message) throw new AssertionError(message, errors);
	if (schema.$id) throw new AssertionError(`Invalid data provided for type: ${schema.$id}.`, errors);
	throw new AssertionError(`Invalid data provided, did not match expected schema.`, errors);
}

export const assert = assertType;
