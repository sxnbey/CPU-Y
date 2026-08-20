import {
  IDynamicBlueprintConfig,
  IDynamicBlueprint,
  RegistryMap,
} from "../contracts/index.js";

export class DynamicBlueprint implements IDynamicBlueprint {
  readonly id!: string;
  readonly targetRegistry!: keyof RegistryMap;
  [key: string]: unknown;

  constructor(config: IDynamicBlueprintConfig) {
    const { id, targetRegistry } = config || {};

    if (!id || !targetRegistry)
      throw new Error(
        `Missing required properties 'id' and 'targetRegistry' in dynamic blueprint configuration.`,
      );

    Object.assign(this, config);
  }
}
