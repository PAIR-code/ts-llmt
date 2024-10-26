/**
 * @license SPDX-License-Identifier: Apache-2.0
 */

import {
  template,
  nv,
  Template,
  TemplVar,
  escapeStr,
  unEscapeStr,
  matchTemplate,
} from './template';
import { FewShotTemplate, matchFewShotTemplate } from './fewshot_template';
import { NamedVar } from './variable';

export = {
  Template,
  NamedVar,
  TemplVar,
  escapeStr,
  template,
  nv,
  unEscapeStr,
  matchTemplate,
  FewShotTemplate,
  matchFewShotTemplate,
};
