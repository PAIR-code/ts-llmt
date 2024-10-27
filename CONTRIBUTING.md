# How to contribute

We'd love to accept your patches and contributions to this project.

## Before you begin

### Sign our Contributor License Agreement

Contributions to this project must be accompanied by a
[Contributor License Agreement](https://cla.developers.google.com/about) (CLA).
You (or your employer) retain the copyright to your contribution; this simply
gives us permission to use and redistribute your contributions as part of the
project.

If you or your current employer have already signed the Google CLA (even if it
was for a different project), you probably don't need to do it again.

Visit <https://cla.developers.google.com/> to see your current agreements or to
sign a new one.

### Review our community guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google/conduct/).

## Contribution process

### Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

### Environment

To set a clean environment for development you can first run `npm clean-install`
to download dependencies.

### Testing

To run unit tests:

- `npm run test:ci` - Run tests once, with extra long timeout.
- `npm run test:dev` - Run tests continuously, rerunning on code change.
- `npm run test:trace` - Run tests once, with `--trace-warnings` and `verbose`.

Running `npm test` will invoke `test:dev`.

### License: Apache 2.0

Source code for this library is released under the [Apache 2.0
license](https://spdx.org/licenses/Apache-2.0.html). Each source code file MUST
start with an [SPDX](https://spdx.dev/) license header at the top of the file
that matches the one here:
[`.github/license-check/header-Apache-2.0.txt`](.github/license-check/header-Apache-2.0.txt).
To check whether all source files have such a header, you can run:

```sh
npm run lint
```

The full text of the Apache-2.0 license is available in the accompanying
`LICENSE` file.

### Linting

This project uses [ESLint](https://eslint.org/) to enforce code style, including
checking the license headers. To run:

```sh
npm run lint
```

The output will tell you if there are any lint errors or files missing the
license header. If there are no lint errors, the command will produce no output.
To automatically add the right headers, and do other automated lint fixes, you
can run:

```sh
npm run lint --fix
```

If you are using Visual Stuido Code with the official [Microsoft ESLint
extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
files will be automatically checked as you edit them.

### Checking Code Style

This project defines and checks code style with
[Prettier](https://prettier.io/). Invoke Prettier from the command line via the
following:

- `npm run prettier:check` - Check _.js and _.ts files for style conformance.
- `npm run prettier:write` - Overwrite files with Prettier applied style.

NOTE: If you're using Visual Studio Code, the [Prettier
extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
will apply code style on save.

### Commit messages

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
