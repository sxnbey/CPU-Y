import type { KnownRegistries } from "#contract";
import type { MainRegistry } from "./main-registry.js";

import { RegistryError } from "#kernel/error/errors";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public getRegistry<K extends keyof KnownRegistries>(
    target: K,
  ): KnownRegistries[K] {
    if (!this.mainRegistry.has(target))
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return this.mainRegistry.get(target);
  }

  public get<T>(target: string): T;

  public get(target: string): unknown {
    if (!this.has(target))
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return this.find(target);
  }

  public find<T>(target: string): T | undefined {
    for (const registry of this.mainRegistry.getAllRegistries())
      if (registry.has(target)) return registry.get(target) as T;

    return undefined;
  }

  public listAll(): string[] {
    const allIds = [];

    for (const registry of this.mainRegistry.getAllRegistries())
      allIds.push(...registry.listAll());

    return allIds;
  }

  public has(target: string): boolean {
    return this.find(target) !== undefined;
  }
}
