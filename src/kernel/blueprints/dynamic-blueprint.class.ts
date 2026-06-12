import { IBlueprintOptions } from "../contracts/interfaces";

import { BaseBlueprint } from "./base-blueprint.class";

export class DynamicBlueprint extends BaseBlueprint {
  constructor(options: IBlueprintOptions) {
    super(options);

    Object.assign(this, options);
  }
}
