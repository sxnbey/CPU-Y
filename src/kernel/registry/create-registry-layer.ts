import type { Constructor, Registry } from "#contract";
import { RegistryResolver } from "#kernel/registry/registry-resolver";

import { MainRegistry } from "#kernel/registry/main-registry";

export function createLayer(
  registries: Constructor<Registry>[],
  parent?: RegistryResolver,
): RegistryResolver {
  const mainRegistry = new MainRegistry();
  const registryResolver = new RegistryResolver(mainRegistry, parent);

  for (const registry of registries) {
    const instance = new registry();

    mainRegistry.register(instance.getName(), instance);
  }

  return registryResolver;
}
