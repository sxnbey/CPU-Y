import "reflect-metadata";

import { IBlueprint } from "../contract/index.js";

export abstract class BaseBlueprint<
  TConfig = {},
> implements IBlueprint<TConfig> {
  constructor(readonly config?: TConfig) {}
}
