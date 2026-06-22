import type { RegistryMap } from "./contracts/index.js";

import { MainRegistry } from "./registries/main-registry.class.js";

export class RegistryResolver {
  constructor(private readonly registry: MainRegistry) {}

  public find<K extends keyof RegistryMap>(target: K): RegistryMap[K];

  public find(target: string): any;

  public find(target: string): any {
    if (this.registry.has(target)) return this.registry.get(target);

    return this.registry
      .getAllRegistries()
      .find((registry) => registry.has(target))
      ?.get(target);
  }
}
