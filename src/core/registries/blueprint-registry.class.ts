import { IBlueprint } from "../../kernel/contracts/interfaces/blueprint.interfaces";

import { BaseRegistry } from "../../kernel/registries/base-registry.class";

export class BlueprintRegistry extends BaseRegistry<
  IBlueprint,
  "blueprintRegistry"
> {
  constructor() {
    super("blueprintRegistry");
  }
}
