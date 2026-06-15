import { IDynamicBlueprintConfig, IDynamicBlueprint } from "../contracts";

import { BaseBlueprint } from "./base-blueprint.class";

export class DynamicBlueprint
  extends BaseBlueprint
  implements IDynamicBlueprint
{
  [key: string]: unknown;

  constructor(config?: IDynamicBlueprintConfig) {
    super(config);

    if (config) this.assignProperties(config);
  }

  private assignProperties(config: IDynamicBlueprintConfig): void {
    Object.entries(config).forEach(([key, value]) => {
      if (Object.hasOwn(this, key)) return;

      this[key] = value;
    });
  }
}
