# TypeScript Large Language Model Templates (TS-LLMT)

This repository holds experimental code aimed at providing native TypeScript
support for Large Language Model Templates. The key idea being explored is that
templates have a type that corresponds to the names of the variables within the
template.

## Environment

To set up your environment for development, first run `npm clean-install` to
download dependencies.

## Testing

To run unit tests:

- `npm run test:ci` - Run tests once, with extra long timeout.
- `npm run test:dev` - Run tests continuously, rerunning on code change.
- `npm run test:trace` - Run tests once, with `--trace-warnings` and `verbose`.

Running `npm test` will invoke `test:dev`.

## Checking Licenses

Source code for this library is released under the [Apache 2.0
license](https://spdx.org/licenses/Apache-2.0.html). Each source code file MUST
include an [SPDX](https://spdx.dev/) license header like this:

```ts
/**
 * @license SPDX-License-Identifier: Apache-2.0
 */
```

To check whether all source files have such a header, run `npm run
check-licenses`. The output will tell you if there are any files missing the
header.
