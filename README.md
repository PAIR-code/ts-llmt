# TypeScript Large Language Model Templates (TS-LLMT)

[![Build Status](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml/badge.svg)](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml)
[![npm latest version](https://img.shields.io/npm/v/ts-llmt/latest.svg)](https://www.npmjs.com/package/ts-llmt)

This repository holds experimental code aimed at providing native TypeScript
support for Large Language Model Templates. The key idea being explored is that
templates have a type that corresponds to the names of the variables within the
template.

For example:

```ts
import { nv, template } from 'ts-llmt';

const thingVar = nv('thing');
const thing2Var = nv('thing2');
// The type of `whatIsAtoB` is inferred to be `Template<"thing" | "thing2">`
const whatIsAtoB = template`what is a ${thingVar} to a ${thing2Var}?`;

// Replacing the thing variable give type:  `Template<"thing2">`
const whatIsTabletoB = whatIsAtoB.vars.thing.substStr('table');

// The escaped raw form of this template is as so:
expect(whatIsTabletoB.escaped).toEqual('what is a table to a {{thing2}}?');
```

A nice feature of this is that you get as "as-you-type" error checking, and
arguments can be auto-completed by the IDE. e.g. you can directly reference the
variables from the 'vars' parameter of a template, and anything else is an
as-you-type error in your editor.

You can do multi-variable replacement nicely, and still have all the wonderful
type-checking like so:

```ts
whatIsAtoB.substs({ thing: 'table', thing2: 'chair' });
expect(whatIsTabletoB.escaped).toEqual('what is a table to a chair?');
```

## License: Apache 2.0

Source code for this library is released under the [Apache 2.0
license](https://spdx.org/licenses/Apache-2.0.html). The full text of the
Apache-2.0 license is available in the accompanying [`LICENSE.md`](./LICENSE.md)
file.

## Contributing

See the [`CONTRIBUTING.md`](./CONTRIBUTING.md) file for details of how to
contribute, setup your environment, run tests, check license headers, style, and
format your commit messages.
