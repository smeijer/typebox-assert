# typebox-assert

> utility function to assert and narrow a type using typebox

## Install

```sh
npm install typebox-assert
```

## Usage

Note that `assertType` does not just assert, it also:

- removes extra properties from value
- generates missing properties using default schema annotations
- converts type mismatches to their target type where possible

The operations are done on the provided object in a mutable manner.

For best practices, we recommend adding an $id to schemas used by `assertType`.

```ts
import { Type } from '@sinclair/typebox';
import { assertType } from 'typebox-assert';

const Person = Type.Object(
	{
		name: Type.String(),
		email: Type.String(),
	},
	{ $id: 'Person' },
);

function createUser(data: unknown) {
	assertType(Person, data); // throws AssertionError when invalid
	db.users.insert(data); // data is narrowed to type `Person`
}
```
