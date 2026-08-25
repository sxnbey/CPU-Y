import {
  IDynamicBlueprintConfig,
  IDynamicBlueprint,
  IBaseMetadata,
} from "../contract/index.js";

export class DynamicBlueprint implements IDynamicBlueprint {
  readonly metadata: IBaseMetadata;
  [key: string]: unknown;

  constructor(readonly config: IDynamicBlueprintConfig) {
    const { id, targetRegistry, ...rest } = config;

    if (!id || !targetRegistry)
      throw new Error(
        `Missing required properties "id" and "targetRegistry" in dynamic blueprint configuration.`,
      );

    Object.assign(this, rest);

    this.metadata = {
      id,
      targetRegistry,
    };
  }
}
