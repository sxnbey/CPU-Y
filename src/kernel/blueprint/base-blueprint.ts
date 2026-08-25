import "reflect-metadata";

import { IBaseMetadata, IBlueprint } from "../contract/index.js";

export abstract class BaseBlueprint<
  TConfig = {},
> implements IBlueprint<TConfig> {
  readonly metadata: IBaseMetadata;

  constructor(readonly config?: TConfig) {
    const metadata = Reflect.getMetadata("system:metadata", this.constructor);

    if (!metadata || !metadata.id || !metadata.targetRegistry) {
      throw new Error(
        `Missing metadata for blueprint ${this.constructor.name}. Please use the decorators to provide metadata.`,
      );
    }

    this.metadata = {
      id: metadata.id,
      targetRegistry: metadata.targetRegistry,
    };
  }
}
