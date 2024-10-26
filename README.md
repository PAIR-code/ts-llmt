# TypeScript Large Language Model Templates (TS-LLMT)

[![Build Status](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml/badge.svg)](https://github.com/PAIR-code/ts-llmt/actions/workflows/release_workflow.yaml)
[![npm latest version](https://img.shields.io/npm/v/ts-llmt/latest.svg)](https://www.npmjs.com/package/ts-llmt)

This repository holds experimental code aimed at providing native TypeScript
support for Large Language Model Templates. The key idea being explored is that
templates have a type that corresponds to the names of the variables within the
template.

For example:

```ts
const thingVar = nv('thing');
const thing2Var = nv('thing2');
const whatIsAtoB = template`what is a ${thingVar} to ${thing2Var}?`;

const whatIsTabletoB = whatIsAtoB.vars.thing.substStr('table');

expect(whatIsTabletoB.escaped).toEqual('what is a table to {{thing2}}?');
```

A nice feature of this is that you get as "as-you-type" error checking, and
arguments can be auto-completed by the IDE. e.g. you can directly reference the
variables from the 'vars' parameter of a template, and anything else is an
as-you-type error in your editor.

You can do multi-variable replacement nicely, and still have all the wonderful
type-checking like so:

```ts
whatIsAtoB.substs({ thing: 'table', thing2: 'chair' });
expect(whatIsTabletoB.escaped).toEqual('what is a table to chair?');
```

## Environment

To set up your environment for development, first run `npm clean-install` to
download dependencies.

## Testing

To run unit tests:

- `npm run test:ci` - Run tests once, with extra long timeout.
- `npm run test:dev` - Run tests continuously, rerunning on code change.
- `npm run test:trace` - Run tests once, with `--trace-warnings` and `verbose`.

Running `npm test` will invoke `test:dev`.

## Linting & License headers

This project uses [ESLint](https://eslint.org/) to enforce code style, including
checking the license headers. To run:

```sh
npm run lint
```

If there are no lint errors, the command will produce no output.

NOTE: If you're using Visual Stuido Code with the official [Microsoft ESLint
extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
files will be automatically checked as you edit them.

### License: Apache 2.0

Source code for this library is released under the [Apache 2.0
license](https://spdx.org/licenses/Apache-2.0.html). Each source code file MUST
start with the [SPDX](https://spdx.dev/) license header in the file
[`.github/license-check/header-Apache-2.0.txt`](.github/license-check/header-Apache-2.0.txt).

To check whether all source files have such a header, run `npm run lint`. The
output will tell you if there are any files missing the header. `npm run lint
--fix` will add headers for you.

The full text of the Apache-2.0 license is available in the accompanying
`LICENSE` file.

## Checking Code Style

This project defines and checks code style with
[Prettier](https://prettier.io/). Invoke Prettier from the command line via the
following:

- `npm run prettier:check` - Check _.js and _.ts files for style conformance.
- `npm run prettier:write` - Overwrite files with Prettier applied style.

NOTE: If you're using Visual Studio Code, the [Prettier
extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
will apply code style on save.

## Commit messages

Commits to this codebase should follow the [conventional
commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

```
<type>[<scope>]: <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: optional short phrase of scope
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test

[optional body]

[optional footer(s)]
```

The `<type>` should be one of the types specified by the [Angular Commit Message
Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format):

- `build`: Changes that affect the build system or external dependencies.
- `ci`: Changes to our CI configuration files and scripts (semantic-release, GitHub Actions).
- `docs`: Documentation only changes.
- `feat`: A new feature.
- `fix`: A bug fix.
- `perf`: A code change that improves performance.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.

The `<description>` should be a sentence describing the change (capitalized
first word, trailing punctuation).

For example, if you fixed a bug in the way `reaction events are handled`, your
commit message might look like this:

```sh
git commit -m "fix: correct reaction event handling"
```

Our release process uses these commit messages to determine the next version
number and to automatically generate the release `CHANGELOG.md` file. So it's
important that your commit messages are clear and meaningful.

## Releasing, Github Actions, and publishing to NPM

New releases are made by merging the `dev` branch into `main`, once you do this,
the workflow for releasing is triggered in github:
`.github/workflows/release_workflow.yaml`. The two key secret variables used for
the release are `GH_TOKEN=...` which has a github personal access token with
permissions as specified in the `release_workflow.yaml`; and `NPM_TOKEN=...`
which has the npmjs.com token that allows writing to the [`ts-llmt`
npm](https://www.npmjs.com/package/ts-llmt)

The release workflow uses
[semantic-release](https://github.com/semantic-release/semantic-release) to
actually do the release; the config file for relasing is:
[`.release.json`](.release.json). Note that the semantic release configuration
uses
[@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer)
to look at commit messages (which are assumed to be formatted according to
[convensional commits](https://www.conventionalcommits.org/en/v1.0.0/)) and
figure out how to change semantic version numbers. This is basically, +1.0.0
(and reset to M.0.0) for Major non-backward compatible changes; +0.1.0 and reset
to M.F.0 for Feature addition changes that are backward compatible, and +0.0.1
for Bugfixes. The semantic-release flow also closes bugs, makes a github
release, and adds labels to pull requests on github. Lots of stuff you might
otherwise try and do by hand.

You can manually run `npx semantic-release` from the `main` github branch.
You'll first need to locally set `GH_TOKEN=...` and `NPM_TOKEN=...`
appropriately.

But the basic thing this does is just run some npm releasing commands, namely:

```sh
npm publish
```

So in a pinch, you can just update versions manually, and run that to deploy.

Note there are two github workflows defined in this project in:

- `.github/workflows/dev_workflow.yaml`: triggered for every pull request
- `.github/workflows/release_workflow.yaml`: tiggered on every merge into the
  main branch (which is intended to indicate that we should be making a relase).
