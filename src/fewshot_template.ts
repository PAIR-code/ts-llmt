/** Copyright 2024 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@license SPDX-License-Identifier: Apache-2.0
============================================================================= */

/*
A few shot template class. This allows separating the template from the list of
values that get subsituted int it.

The implementation is very simple: few shot templates are treated as templates
concatendated by a join string.

For example:

const nameDescriptionTempl = new FewShotTempl(template
  `${namedVar('n')}, can be described in detail by: ${namedVar('d')}`,
  '\n');

See the test file (.spec) for more detailed examples.
*/

import { flatten } from 'underscore';
import {
  Template,
  matchTemplate,
  TemplateMatch,
  escapeStringInMatch,
} from './template';
import { NamedVar } from './variable';

// For each example substitution, substitute it into the template, and join it
// all together with the joinStr, into one big new template.
export function fewShotSubst<N extends string, M extends N, N2s extends string>(
  templ: Template<N>,
  examples: { [Key in M]: string | NamedVar<N2s> }[],
  joinStr: string
): Template<Exclude<N, M> | N2s> {
  const vars = flatten(
    examples.map((e) =>
      Object.values<string | NamedVar<N2s>>(e).filter(
        (r) => typeof r !== 'string'
      )
    )
  ) as NamedVar<N2s>[];
  return new Template<Exclude<N, M> | N2s>(
    examples.map((e) => templ.substs(e).escaped).join(joinStr),
    vars
  );
}

// A class representing a few shot template.
export class FewShotTemplate<Ns extends string> {
  constructor(
    public template: Template<Ns>,
    public joinStr: string
  ) {}

  apply<Ms extends Ns, VarNs extends never>(
    examples: { [Key in Ms]: string }[]
  ): Template<Exclude<Ns, Ms> | VarNs>;
  apply<Ms extends Ns, VarNs extends string>(
    examples: { [Key in Ms]: string | NamedVar<VarNs> }[]
  ): Template<Exclude<Ns, Ms> | VarNs>;
  apply<Ms extends Ns, VarNs extends string>(
    examples: { [Key in Ms]: string | NamedVar<VarNs> }[]
  ): Template<Exclude<Ns, Ms> | VarNs> {
    return fewShotSubst(this.template, examples, this.joinStr);
  }
}

export function matchFewShotTemplate<Ns extends string>(
  fewShotTempl: FewShotTemplate<Ns>,
  str: string
): TemplateMatch<Ns>[] {
  const matches: TemplateMatch<Ns>[] = [];
  const parts = fewShotTempl.template.parts();
  let match = matchTemplate(parts, str);
  matches.push(match);
  while (
    match.matchedPartsCount === match.parts.variables.length &&
    match.finalStr !== ''
  ) {
    let nextStr = match.finalStr;
    const sepMatch = match.finalStr.match(
      `^${escapeStringInMatch(fewShotTempl.joinStr)}`
    );
    if (sepMatch) {
      nextStr = match.finalStr.slice(sepMatch[0].length);
    } else {
      return matches;
    }
    match = matchTemplate(parts, nextStr);
    matches.push(match);
  }
  return matches;
}

// function apply2<Ns extends string, Ms extends Ns>(
//   a: Set<Ns>,
//   bmap: { [Key in Ms]: string }[]
// ): Set<Exclude<Ns, Ms>> {
//   const a2 = new Set<Exclude<Ns, Ms>>(a as any);
//   Object.keys(bmap).forEach((n) => a2.delete(n as any));
//   return a2;
// }

// const r2 = apply2(new Set(['a', 'b', 'c']), [{ a: 'a', b: 'b' }]);
