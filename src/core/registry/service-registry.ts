import { BaseRegistry } from "#kernel/registry/base-registry";

export class ServiceRegistry extends BaseRegistry<"serviceRegistry"> {
  static registryName = "serviceRegistry";
}
