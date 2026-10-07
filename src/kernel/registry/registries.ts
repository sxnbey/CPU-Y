import type { BaseMetadata, RegistryEntry } from "#contract";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class InstanceRegistry extends BaseRegistry<
  "instanceRegistry",
  RegistryEntry<unknown, BaseMetadata>
> {
  constructor() {
    super("instanceRegistry");
  }
}

export class FunctionRegistry extends BaseRegistry<
  "functionRegistry",
  RegistryEntry<(...args: any[]) => any>
> {
  constructor() {
    super("functionRegistry");
  }
}
