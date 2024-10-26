import {
  template,
  nv,
  Template,
  TemplVar,
  TemplateMatch,
  escapeStr,
  unEscapeStr,
  matchTemplate,
} from "./template";
import { FewShotTemplate, matchFewShotTemplate } from "./fewshot_template";
import { NamedVar } from "./variable";

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
