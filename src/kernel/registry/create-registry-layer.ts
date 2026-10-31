import type { Constructor, Registry } from "#contract";
import { RegistryResolver } from "#kernel/registry/registry-resolver";

import { MainRegistry } from "#kernel/registry/main-registry";

export type RegistryLayer = ReturnType<typeof createLayer>;

export function createLayer(
  registries: Constructor<Registry>[],
  parent?: RegistryResolver,
) {
  const mainRegistry = new MainRegistry();
  const registryResolver = new RegistryResolver(mainRegistry, parent);

  for (const Registry of registries) {
    const instance = new Registry();

    mainRegistry.register(instance.getName(), instance);
  }

  return { mainRegistry, registryResolver };
}
