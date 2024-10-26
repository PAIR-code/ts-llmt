/**
 * @license SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Configuration for ESLint.
 */

// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import licenseHeader from "eslint-plugin-license-header";

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'license-header': licenseHeader
    },
    rules: {
      'license-header/header': [
        'error',
        './.github/license-check/header-Apache-2.0.txt'
      ]
    }
  }
);

export default config;
