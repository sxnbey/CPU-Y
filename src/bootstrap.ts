import { IRegistry } from "#kernel/contract/index";
import { IRegistryMap } from "#kernel/contract/index";

import { System } from "./system.js";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { ServiceRegistry } from "#core/registry/service-registry";

export function bootstrap(): System {
  const mainRegistry = new MainRegistry();
  const registryResolver = new RegistryResolver(mainRegistry);

  const registries = [new ServiceRegistry()] satisfies IRegistry<
    keyof IRegistryMap
  >[];

  registries.forEach((registry) => {
    mainRegistry.register(registry.getName(), registry);
  });

  const system = new System(mainRegistry, registryResolver);

  return system;
}
