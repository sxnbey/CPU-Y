import { IBlueprint, IBlueprintOptions } from "../contracts/IBlueprint";

import { KernelBridge } from "../KernelBridge";

export abstract class BaseBlueprint implements IBlueprint {
  readonly id!: string;
  readonly kind!: string;
  readonly validator!: string;
  readonly location!: string;

  constructor(
    data: IBlueprintOptions,
    protected readonly bridge: KernelBridge,
  ) {
    Object.assign(this, data);
  }
}
