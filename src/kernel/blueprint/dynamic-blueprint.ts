import {
  IDynamicBlueprintConfig,
  IDynamicBlueprint,
} from "#kernel/contract/index";

export class DynamicBlueprint implements IDynamicBlueprint {
  [key: string]: unknown;

  constructor(readonly config: IDynamicBlueprintConfig) {
    const { _id, _targetRegistry, ...rest } = config;

    Object.assign(this, rest);
  }
}
