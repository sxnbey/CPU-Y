import type { IServiceMetadata, IRegistryEntry } from "#contract";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class ServiceRegistry extends BaseRegistry<
  "serviceRegistry",
  IRegistryEntry<unknown, IServiceMetadata>
> {
  constructor() {
    super("serviceRegistry");
  }
}
