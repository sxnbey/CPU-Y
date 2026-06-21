import { IDynamicBlueprintConfig, IDynamicBlueprint } from "../contracts";

import { BaseBlueprint } from "./base-blueprint.class";

export abstract class DynamicBlueprint
  extends BaseBlueprint<IDynamicBlueprintConfig>
  implements IDynamicBlueprint
{
  [key: string]: unknown;

  constructor(config?: IDynamicBlueprintConfig) {
    super(config);

    if (config) this.assignProperties(config);
  }

  private assignProperties(config: IDynamicBlueprintConfig): void {
    Object.entries(config).forEach(([key, value]) => {
      if (key in this) return;

      this[key] = value;
    });
  }
}
