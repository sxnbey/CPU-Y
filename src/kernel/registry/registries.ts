import type { InstanceMetadata, RegistryEntry } from "#contract";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class InstanceRegistry extends BaseRegistry<
  "instanceRegistry",
  RegistryEntry<unknown, InstanceMetadata>
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
