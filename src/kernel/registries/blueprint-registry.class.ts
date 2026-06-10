import { IBlueprint } from "../contracts/interfaces/blueprint.interface";

import { BaseRegistry } from "./base-registry.class";

export class BlueprintRegistry extends BaseRegistry<
  IBlueprint,
  "blueprintRegistry"
> {
  constructor() {
    super("blueprintRegistry");
  }
}
