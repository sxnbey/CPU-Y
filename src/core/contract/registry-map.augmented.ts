import { ServiceRegistry } from "#core/registry/service-registry";

declare module "#kernel/contract/index" {
  interface IRegistryMap {
    serviceRegistry: ServiceRegistry;
  }
}
