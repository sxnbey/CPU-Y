import {
  IDynamicBlueprintOptions,
  IDynamicBlueprint,
} from "../contracts/interfaces";

import { BaseBlueprint } from "./base-blueprint.class";

export class DynamicBlueprint
  extends BaseBlueprint
  implements IDynamicBlueprint
{
  [key: string]: unknown;

  constructor(options?: IDynamicBlueprintOptions) {
    super(options);

    if (options) this.assignProperties(options);
  }

  private assignProperties(options: IDynamicBlueprintOptions): void {
    Object.entries(options).forEach(([key, value]) => {
      if (Object.hasOwn(this, key)) return;

      this[key] = value;
    });
  }
}
