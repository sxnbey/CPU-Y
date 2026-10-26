import type { KnownRegistries, Registry } from "#contract";
import type { MainRegistry } from "./main-registry.js";

import { RegistryError } from "#kernel/error/errors";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public getRegistry<K extends keyof KnownRegistries>(
    target: K,
  ): KnownRegistries[K];

  public getRegistry(target: string): Registry;

  public getRegistry(target: string): Registry {
    return this.mainRegistry.get(target);
  }

  public get(target: string): unknown {
    const registry = this.locate(target);

    if (!registry)
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return registry.get(target);
  }

  public find(target: string): unknown {
    return this.locate(target)?.get(target);
  }

  public listAllIds(): unknown[] {
    return this.mainRegistry
      .getAllRegistries()
      .flatMap((registry) => registry.listAllIds());
  }

  public has(target: string): boolean {
    return this.locate(target) !== undefined;
  }

  private locate(target: string): Registry | undefined {
    for (const registry of this.mainRegistry.getAllRegistries())
      if (registry.has(target)) return registry;
  }
}
