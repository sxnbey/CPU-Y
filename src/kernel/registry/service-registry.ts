import type { RegistryPayloadMap } from "#contract";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class ServiceRegistry extends BaseRegistry<
  "serviceRegistry",
  RegistryPayloadMap["serviceRegistry"]
> {
  constructor() {
    super("serviceRegistry");
  }
}
