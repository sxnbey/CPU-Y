import { IRegistryEntry } from "#kernel/contract/index";
import { IServiceMetadata } from "#core/contract/index";

import { BaseRegistry } from "#kernel/registry/base-registry";

export class ServiceRegistry extends BaseRegistry<
  "serviceRegistry",
  IRegistryEntry<unknown, IServiceMetadata>
> {
  constructor() {
    super("serviceRegistry");
  }
}
