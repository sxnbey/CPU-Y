import "reflect-metadata";

import { IBlueprint, RegistryMap } from "../contracts/index.js";

export abstract class BaseBlueprint<
  TConfig = {},
> implements IBlueprint<TConfig> {
  readonly id: string;
  readonly targetRegistry: keyof RegistryMap;

  constructor() {
    const metadata = Reflect.getMetadata("system:metadata", this.constructor);

    this.id = metadata?.id;
    this.targetRegistry = metadata?.targetRegistry;
  }
}
