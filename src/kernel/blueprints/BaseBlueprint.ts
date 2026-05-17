import { IBlueprint, IBlueprintOptions } from "../contracts/IBlueprint";

import { RegistryBridge } from "../RegistryBridge";

export abstract class BaseBlueprint implements IBlueprint {
  readonly id!: string;
  readonly kind!: string;
  readonly validator!: string;
  readonly location!: string;

  constructor(
    data: IBlueprintOptions,
    protected readonly bridge: RegistryBridge,
  ) {
    Object.assign(this, data);
  }
}
