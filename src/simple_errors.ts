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

/**
 * @fileoverview Error types and assertions for testing.
 */

export interface AbstractErrorResponse {
  error: unknown;
}

export interface ErrorResponse {
  error: string;
}

export function isErrorResponse<T, E extends AbstractErrorResponse>(
  response: T | E
): response is E {
  if ((response as E).error) {
    return true;
  }
  return false;
}

export function assertNoErrorResponse<T, E extends AbstractErrorResponse>(
  response: T | E
): asserts response is T {
  if ((response as E).error) {
    throw new Error('response was an error after all');
  }
}
