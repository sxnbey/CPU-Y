import "reflect-metadata";

import { BlueprintSchemaRules } from "../../kernel/contract/index.js";

export function Rules(rules: BlueprintSchemaRules): ClassDecorator {
  return (target) => {
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
