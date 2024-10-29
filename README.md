# TypeScript Large Language Model Templates (TS-LLMT)

[![Build Status](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml/badge.svg)](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml)
[![npm latest version](https://img.shields.io/npm/v/ts-llmt/latest.svg)](https://www.npmjs.com/package/ts-llmt)

This repository holds experimental code aimed at providing native TypeScript
support for Large Language Model Templates.

The key idea is to track "named-holes" in templates at type-checking (typing)
time. This means:

- You never need to debug an accidental subsitution for the wrong variable name.
- You can substite for some variables but not others, in any order you like, and the remaining
  variables are tracked in the type.
- You can subsitute templates with more holes into named-hole in a template, and you get the correct
  remaining holes in the right places in the final template.
- The same hole can appear in multiple places, subsitution substitutes it everywhere, as you would
  expect.
- There is support for few-shot prompts (where you have some iterated template
  over a data strutcure).

Here's a mini-example:

```ts
import { nv, template } from 'ts-llmt';

const thingVar = nv('thing');
const thing2Var = nv('thing2');
// *NOTE*: type of `whatIsAtoB` is magically inferred to be:
//         `Template<"thing" | "thing2">`
const whatIsAtoB = template`what is a ${thingVar} to a ${thing2Var}?`;

// Replacing the `thing` variable in whatIsAtoB, gives the type:
//         `Template<"thing2">`
const whatIsTabletoB = whatIsAtoB.vars.thing.substStr('table');

// The escaped raw form of this template is as so:
expect(whatIsTabletoB.escaped).toEqual('what is a table to a {{thing2}}?');
```

The key nice feature of this is that you get _as "as-you-type" error checking_,
and _arguments can be auto-completed by the IDE_. You can never substitute for a
variable that is not there.

You can do multi-variable replacement nicely too, and still have all the
wonderful type-checking like so:

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
