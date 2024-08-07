/**
 * @license SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Jest configuration.
 */

export default {
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
  testEnvironment: "node",
  testRegex: "/(src|test)/.*\\.(spec|test)?\\.(ts|tsx)$",
  transform: { "^.+\\.ts?$": "ts-jest" },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
