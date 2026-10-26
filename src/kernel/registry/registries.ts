import type { RegistryPayloadMap } from "#contract";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class InstanceRegistry extends BaseRegistry<
  "instanceRegistry",
  RegistryPayloadMap["instanceRegistry"]
> {
  constructor() {
    super("instanceRegistry");
  }
}

export class FunctionRegistry extends BaseRegistry<
  "functionRegistry",
  RegistryPayloadMap["functionRegistry"]
> {
  constructor() {
    super("functionRegistry");
  }
}
