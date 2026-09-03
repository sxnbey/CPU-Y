import type { IRegistryMap } from "#kernel/contract/index";

import { MainRegistry } from "./main-registry.js";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public find<K extends keyof IRegistryMap>(target: K): IRegistryMap[K];

  public find<T>(target: string): T | undefined;

  public find(target: unknown): unknown {
    if (typeof target !== "string") return undefined;

    if (this.mainRegistry.has(target)) return this.mainRegistry.get(target);

    for (const registry of this.mainRegistry.getAllRegistries()) {
      if (registry.has(target)) return registry.get(target);
    }

    return undefined;
  }

  public has(target: string): boolean {
    return this.find(target) !== undefined;
  }
}
