import type { RegistryEntry, RegistryMap } from "#contract";
import type { MainRegistry } from "./main-registry.js";

import { RegistryError } from "#kernel/error/errors";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public getRegistry<K extends keyof RegistryMap & string>(
    target: K,
  ): RegistryMap[K] {
    if (!this.mainRegistry.has(target))
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return this.mainRegistry.get(target);
  }

  public get<T = unknown>(target: string): T;

  public get(target: string): unknown {
    if (!this.has(target))
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return this.find(target);
  }

  public find<T = unknown>(target: string): T | undefined {
    for (const registry of this.mainRegistry.getAllRegistries())
      if (registry.has(target)) return registry.get(target) as T;

    return undefined;
  }

  public listAll<T = unknown>(): T[] {
    return this.mainRegistry
      .getAllRegistries()
      .flatMap((registry) => registry.listAll());
  }

  public listAllWrapped(): RegistryEntry<unknown>[] {
    return this.mainRegistry
      .getAllRegistries()
      .flatMap((registry) => registry.listAllWrapped());
  }

  public has(target: string): boolean {
    return this.find(target) !== undefined;
  }
}
