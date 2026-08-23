import "reflect-metadata";

import { IBlueprint, RegistryMap } from "../contracts/index.js";

export abstract class BaseBlueprint<
  TConfig = {},
> implements IBlueprint<TConfig> {
  readonly id: string;
  readonly targetRegistry: keyof RegistryMap;
  readonly config?: TConfig | undefined;

  constructor(config?: TConfig) {
    const metadata = Reflect.getMetadata("system:metadata", this.constructor);

    if (!metadata || !metadata.id || !metadata.targetRegistry) {
      throw new Error(
        `Missing metadata for blueprint ${this.constructor.name}. Please use the @Metadata decorator to provide metadata.`,
      );
    }

    this.id = metadata.id;
    this.targetRegistry = metadata.targetRegistry;
    this.config = config;
  }
}
