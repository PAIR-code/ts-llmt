/**
 * @license SPDX-License-Identifier: Apache-2.0
 */

/* Test call to The Google-Cloud-Vertex-AI-API Palm2 LLM.

Assumes: node is installed (you have the npx command).
See https://github.com/nvm-sh/nvm

Usage:

npx ts-node --esm ./run_vertexapi_palm2_predict_rec_test.ts \
  --project=$(gcloud config get-value project) \
  --accessToken=$(gcloud auth print-access-token) \
  --experience="The Garden of Forking Paths: like it"

Assumes that you have run:
  gcloud config set project ${YOUR_GOOGLE_CLOUD_PROJECT_ID}
*/
import { VertexPalm2LLM } from "../llm_vertexapi_palm2";
import { expInterpTempl } from "../recommender_prompts/item_interpreter";

import * as yargs from "yargs";
import { fillTemplate } from "../llm";
import { ErrorResponse } from "../simple_errors";

interface Params {
  accessToken: string;
  project: string;
  experience: string;
}

async function run(args: Params): Promise<void> {
  const llm = new VertexPalm2LLM(args.project, args.accessToken);
  const templateToFill = expInterpTempl.substs({ experience: args.experience });
  console.log("template: \n\n", templateToFill.escaped);
  console.log("\n\n");
  const responsesOrError = await fillTemplate(llm, templateToFill);

  if ("error" in responsesOrError) {
    throw responsesOrError;
  }

  const responses = responsesOrError as Exclude<
    typeof responsesOrError,
    ErrorResponse
  >;

  const badlyFormedResponsesCount = responses.filter((r) => !r.substs).length;
  console.log(`badlyFormedResponses count: ${badlyFormedResponsesCount}`);
  console.log(`responses: ${JSON.stringify(responses, null, 2)} `);

  responses
    .filter((r) => r.substs)
    .forEach((r, i) => console.log(i, JSON.stringify(r.substs, null, 2)));
}

// ----------------------------------------------------------------------------
const args = yargs
  .option("accessToken", {
    describe:
      "Google Cloud Auth Token " +
      "e.g. echo $(gcloud auth print-access-token)",
    demandOption: true,
    type: "string",
  })
  .option("project", {
    describe:
      "The Google Cloud Project to use (it must have the VertexAI " +
      "API enabled).",
    demandOption: true,
    type: "string",
  })
  .option("experience", {
    describe: "Short text of an experience.",
    demandOption: true,
    type: "string",
  })
  .help().argv;

run(args as Params)
  .then(() => {
    console.log("Success!");
  })
  .catch((e) => {
    console.error("Failed: ", e);
    throw Error("Failed");
  });
