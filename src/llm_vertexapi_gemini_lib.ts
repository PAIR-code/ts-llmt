/**
 * @license SPDX-License-Identifier: Apache-2.0
 */

/*
Common definitons for Vertex AI Gemini API

See:
https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference
*/

// ----------------------------------------------------------------------------
//  Requests to the Gemini API
// ----------------------------------------------------------------------------

// TODO flesh this out.
export type GeminiResponseSchema = unknown;

export type GeminiApiRequestConfig = Partial<{
  temperature: number; // 0.0 - 2.0 (default: 1.0)
  topP: number;
  topK: number;
  candidateCount: number;
  maxOutputTokens: number;
  presencePenalty: number; // float
  frequencyPenalty: number; // float
  stopSequences: string[];
  responseMimeType: string;
  responseSchema: GeminiResponseSchema;
  seed: number;
  responseLogprobs: boolean;
  logprobs: number;
  audioTimestamp: boolean;
}>;

export type GeminiContentPart =
  | { text: string }
  | {
      inlineData: {
        mimeType: string;
        data: string;
      };
    }
  | {
      fileData: {
        mimeType: string;
        fileUri: string;
      };
    }
  | {
      videoMetadata: {
        startOffset: {
          seconds: number;
          nanos: number;
        };
        endOffset: {
          seconds: number;
          nanos: number;
        };
      };
    };

export type GeminiApiSystemInstruction = Partial<{
  role: string; // Note: ignored.
  parts: [
    {
      text: string;
    },
  ];
}>;

export type GeminiApiRequestContent = {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
};

export enum HarmCategory {
  HARM_CATEGORY_SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  HARM_CATEGORY_HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH',
  HARM_CATEGORY_HARASSMENT = 'HARM_CATEGORY_HARASSMENT',
  HARM_CATEGORY_DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT',
}

export enum HarmBlockThreshold {
  OFF = 'OFF',
  BLOCK_NONE = 'BLOCK_NONE',
  BLOCK_LOW_AND_ABOVE = 'BLOCK_LOW_AND_ABOVE',
  BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE',
  BLOCK_ONLY_HIGH = 'BLOCK_ONLY_HIGH',
}

export enum HarmBlockMethod {
  HARM_BLOCK_METHOD_UNSPECIFIED = 'HARM_BLOCK_METHOD_UNSPECIFIED',
  SEVERITY = 'SEVERITY',
  PROBABILITY = 'PROBABILITY',
}

export type GeminiApiRequestSafetySettings = {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
  method: HarmBlockMethod;
}[];

export type GeminiRequestOptions = {
  generationConfig?: GeminiApiRequestConfig;
  systemInstruction?: GeminiApiSystemInstruction;
  cachedContent?: string;
  safetySettings?: GeminiApiRequestSafetySettings;
};

export type GeminiApiRequest = {
  contents: GeminiApiRequestContent[];
} & GeminiRequestOptions;

// ----------------------------------------------------------------------------
//  Responses from the Gemini API
// ----------------------------------------------------------------------------

export interface GeminiValidResponse {
  candidates: {
    content: {
      role: 'model';
      parts: GeminiContentPart[];
    };
    finishReason: 'STOP';
    avgLogprobs: number;
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
}

export interface GeminiError {
  error: {
    code: number;
    details: unknown[];
    message: string;
    status: string;
  };
}

export type GeminiResponse = GeminiValidResponse | GeminiError;

// ----------------------------------------------------------------------------
//  API options
// ----------------------------------------------------------------------------

export interface GeminiApiOptions {
  modelId: string;
  location: string;
  requestOptions?: GeminiRequestOptions;
}

export const DEFAULT_OPTIONS: GeminiApiOptions = {
  modelId: 'gemini-1.5-flash-002',
  location: 'us-central1',
};

// ----------------------------------------------------------------------------
//  Utilities
// ----------------------------------------------------------------------------

export function prepareGeminiRequest(
  query: string,
  params?: GeminiRequestOptions
): GeminiApiRequest {
  return {
    ...params,
    contents: [
      {
        role: 'user',
        parts: [{ text: query }],
      },
    ],
  };
}

export function overideRequestOptions(
  defaultOptions: GeminiRequestOptions,
  newOptions: GeminiRequestOptions
): GeminiRequestOptions {
  const requestOptions: GeminiRequestOptions = {
    ...defaultOptions,
    ...newOptions,
  };
  if (defaultOptions.generationConfig || newOptions.generationConfig) {
    requestOptions.generationConfig = {
      ...defaultOptions.generationConfig,
      ...newOptions.generationConfig,
    };
  }
  return requestOptions;
}

export function overideApiOptions(
  defaultOptions: Partial<GeminiApiOptions>,
  newOptions: Partial<GeminiApiOptions>
): Partial<GeminiApiOptions> {
  const requestOptions =
    defaultOptions.requestOptions && newOptions.requestOptions
      ? overideRequestOptions(
          defaultOptions.requestOptions,
          newOptions.requestOptions
        )
      : newOptions.requestOptions || defaultOptions.requestOptions;
  return { ...defaultOptions, ...newOptions, requestOptions };
}
