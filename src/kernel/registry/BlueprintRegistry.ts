import { IBlueprint } from "../contracts/IBlueprint";

import { BaseRegistry } from "./BaseRegistry";

export class BlueprintRegistry extends BaseRegistry<
  IBlueprint,
  "blueprintRegistry"
> {
  constructor() {
    super({ name: "blueprintRegistry" });
  }
}
