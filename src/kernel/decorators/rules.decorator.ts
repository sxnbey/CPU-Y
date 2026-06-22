import "reflect-metadata";

import { BlueprintSchemaRules } from "../contracts/index.js";

export function Rules(rules: BlueprintSchemaRules): Function {
  return (target: Function) => {
    const existingRules: BlueprintSchemaRules = Reflect.getMetadata(
      "system:rules",
      target,
    );

    Reflect.defineMetadata(
      "system:rules",
      { ...existingRules, ...rules },
      target,
    );
  };
}
