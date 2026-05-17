import { BaseRegistry } from "./BaseRegistry";

import { IBlueprint } from "../contracts/IBlueprint";

export class BlueprintRegistry extends BaseRegistry<
  IBlueprint,
  "blueprintRegistry"
> {
  constructor() {
    super({ name: "blueprintRegistry" });
  }
}
