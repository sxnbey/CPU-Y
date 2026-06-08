import { IBlueprint, IBlueprintOptions } from "../contracts/IBlueprint";

import { KernelContext } from "../KernelContext";

export abstract class BaseBlueprint implements IBlueprint {
  readonly id!: string;
  readonly kind!: string;
  readonly validator!: string;
  readonly location!: string;

  constructor(
    data: IBlueprintOptions,
    protected readonly bridge: KernelContext,
  ) {
    Object.assign(this, data);
  }
}
