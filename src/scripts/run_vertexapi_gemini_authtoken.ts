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

/* Test call to The Google-Cloud-Vertex-AI-API Gemini LLM.

Assumes: node is installed (you have the npx command).
See https://github.com/nvm-sh/nvm

Usage:

npx ts-node ./run_vertexapi_gemini_authtoken.ts \
  --project=$(gcloud config get-value project) \
  --accessToken=$(gcloud auth print-access-token) \
  --movie="The Untouchables"

Assumes that you have run:
  gcloud config set project ${YOUR_GOOGLE_CLOUD_PROJECT_ID}
  gcloud auth login

You should then see something like: 

```
---- 0 ----
I think you'll find the movie The Untouchables:

* stylishly violent, a classic gangster film

* a powerful and moving story of justice

Do you like my summary?

---- 1 ----
...
---- 3 ----
...
Do you like my summary?
Success!
```

*/
import { VertexGeminiLLM } from '../llm_vertexapi_gemini_1_5_authtoken';
import { FewShotTemplate } from '../fewshot_template';

import * as yargs from 'yargs';
import { nv, template } from '../template';
import { fillTemplate } from '../llm';
import { isErrorResponse } from '../simple_errors';

interface Params {
  project: string;
  movie: string;
  accessToken: string;
}

function prettyMovieRec(
  index: number,
  movie: string,
  summaries: string
): string {
  const outputFormat = template`
---- ${nv('index')} ----
I think you'll find the movie ${nv('movie')}:

${nv('bullets')}

Do you like my summary?`;
  const splitSummaries = summaries.split(`', '`).map((summaryPoint) => {
    return { summaryPoint };
  });
  const outputBullets = new FewShotTemplate(
    template`* ${nv('summaryPoint')}`,
    '\n\n'
  );
  const bullets = outputBullets.apply(splitSummaries).stringify();
  // Notice the nice type error is I try and and stringify, but forgot to
  // fill in the template...
  //   Type 'Error_CannotStringifyTemplateWithVars<"index">' is not assignable
  //   to type 'string'.
  // return outputFormat.substs({ movie, bullets }).stringify();
  return outputFormat.substs({ movie, bullets, index: `${index}` }).stringify();
}

async function run(args: Params): Promise<void> {
  // Notice the few-shot prompt doesn't always have a synopsis or rating, but
  // we want to always generate them.
  const t = template`
The following are short movie summaries. They are specific, not generic (no movie is just "a classic"), and they don't contain plot synopsis. They just describe the experience of watching the movie. It tries to tell you the essence of the movie.

movie: 'Fifth Element'
summary: ['joyous sci fi that emerses you in a colourful universe', 'quirky upbeat action']
synopsis: 'The 23rd century, a New York City cabbie, Korben Dallas (Bruce Willis), finds the fate of the world in his hands when Leeloo (Milla Jovovich) falls into his cab. As the embodiment of the fifth element, Leeloo needs to combine with the other four to keep the approaching Great Evil from destroying the world.'

movie: 'Seven Samurai'
summary: ['black and white masterpiece of cinematography', 'a slow, atmospheric, symbolic fight for all that is just']
rating (1 to 5 scale): 5

movie: '${nv('movie')}'
summary: ['${nv('summaries')}']
rating (1 to 5 scale): ${nv('rating', { match: '[12345](.\\d)?' })}
synopsis: '${nv('synopsis')}'`;

  const llm = new VertexGeminiLLM(args.project, args.accessToken, {
    requestOptions: {
      generationConfig: {
        temperature: 1.0,
        candidateCount: 4,
      },
    },
  });
  const templateToFill = t.substs({ movie: args.movie });
  const responses = await fillTemplate(llm, templateToFill);
  if (isErrorResponse(responses)) {
    throw new Error(responses.error);
  }
  const badlyFormedResponsesCount = responses.filter((r) => !r.substs).length;
  console.log(`badlyFormedResponses count: ${badlyFormedResponsesCount}`);
  console.log(`responses: ${JSON.stringify(responses, null, 2)} `);

  responses
    .filter((r) => r.substs)
    .forEach((r, i) =>
      console.log(prettyMovieRec(i, args.movie, r.substs!.summaries))
    );
}

// ----------------------------------------------------------------------------
const args = yargs
  .option('accessToken', {
    describe:
      'Google Cloud Auth Token ' +
      'e.g. echo $(gcloud auth print-access-token)',
    demandOption: true,
    type: 'string',
  })
  .option('project', {
    describe:
      'The Google Cloud Project to use (it must have the VertexAI ' +
      'API enabled).',
    demandOption: true,
    type: 'string',
  })
  .option('movie', {
    describe: 'The name of a movie to get a review of',
    demandOption: true,
    type: 'string',
  })
  .help().argv;

run(args as Params)
  .then(() => {
    console.log('Success!');
  })
  .catch((e) => {
    console.error('Failed: ', e);
    throw Error('Failed');
  });
