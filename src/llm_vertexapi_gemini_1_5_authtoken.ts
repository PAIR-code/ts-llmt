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
A minimal Google Cloud Vertex Gemini API, using an accessToken for auth.

Consider using the *_googleauth version of this library since that uses gaxios
which will refersh tokens and use google cloud auth behind the scenes senisbly.

See the scripts/ directory for an example of using this.

See:
https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference
*/

import { LLM, PredictResponse } from './llm';
import { isErrorResponse } from './simple_errors';
import {
  DEFAULT_OPTIONS,
  GeminiApiOptions,
  GeminiApiRequest,
  GeminiResponse,
  overideApiOptions,
  prepareGeminiRequest,
} from './llm_vertexapi_gemini_lib';

async function postDataToLLM(
  url = '',
  accessToken: string,
  data: GeminiApiRequest
): Promise<GeminiResponse> {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  const geminiResponse = await response.json(); // parses JSON response into native JavaScript objects
  return geminiResponse as GeminiResponse;
}

export async function sendGeminiRequest(
  projectId: string,
  accessToken: string,
  req: GeminiApiRequest,
  modelId = 'text-bison', // e.g. text-bison for latest text-bison model
  location = 'us-central1',
  streamOrGenerate = 'generateContent' // | 'streamGenerateContent'
): Promise<GeminiResponse> {
  return postDataToLLM(
    // TODO: it may be that the url part 'us-central1' has to match
    // apiEndpoint.
    `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:${streamOrGenerate}`,
    accessToken,
    req
  );
}

export class VertexGeminiLLM implements LLM<GeminiApiOptions> {
  public name: string;
  public options: Partial<GeminiApiOptions>;

  constructor(
    public projectId: string,
    // Note: these normally don't live long...
    public accessToken: string,
    public initOptions?: Partial<GeminiApiOptions>
  ) {
    this.options = overideApiOptions(DEFAULT_OPTIONS, initOptions || {});
    this.name = `VertexLLM:` + this.options.modelId;
  }

  async predict(
    query: string,
    options?: Partial<GeminiApiOptions>
  ): Promise<PredictResponse> {
    options = overideApiOptions(this.options, options || {});
    const apiRequest: GeminiApiRequest = prepareGeminiRequest(
      query,
      options.requestOptions
    );

    const apiResponse = await sendGeminiRequest(
      this.projectId,
      this.accessToken,
      apiRequest,
      this.options.modelId,
      this.options.location
    );

    // TODO: consider how to handle stop sequences, e.g. create a
    // imaginedPostfixStopSeq with the used stopSequence.

    if (isErrorResponse(apiResponse)) {
      throw new Error(
        `Error in api response:` +
          ` ${JSON.stringify(apiResponse.error, null, 2)}`
      );
    }

    if (!apiResponse.candidates) {
      throw new Error(
        `No predictions returned in api response:` +
          ` ${JSON.stringify(apiResponse, null, 2)}`
      );
    }

    // TODO: skip this and simplify?
    const scoredCompletions = apiResponse.candidates.map((p) => {
      return {
        query: query,
        completion: p.content.parts
          .map((p) => {
            if ('text' in p) {
              return p.text;
            } else {
              return '<unknown part>';
            }
          })
          .join(' <nextpart> '),
        score: p.avgLogprobs,
      };
    });

    return { completions: scoredCompletions.map((c) => c.completion) };
  }

  // TODO: The cloud API doesn't currently support scoring.
  // async score(request: ScoreRequest): Promise<ScoreResponse> {
  // }
}
