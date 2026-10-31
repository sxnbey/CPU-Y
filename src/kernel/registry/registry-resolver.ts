import type { Registry, RegistryName } from "#contract";
import type { MainRegistry } from "./main-registry.js";

import { RegistryError } from "#kernel/error/errors";

export class RegistryResolver {
  constructor(
    private readonly mainRegistry: MainRegistry,
    private readonly parent?: RegistryResolver,
  ) {}

  public getRegistry(registryName: RegistryName): Registry {
    return (
      this.mainRegistry.get(registryName) ||
      this.parent?.getRegistry(registryName)
    );
  }

  public get(id: string): unknown {
    const registry = this.locate(id);

    if (!registry)
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: id, origin: this.constructor.name },
      });

    return registry.get(id);
  }

  public find(id: string): unknown {
    return this.locate(id)?.get(id);
  }

  public listAllIds(): string[] {
    return this.mainRegistry
      .getAllRegistries()
      .flatMap((registry) => registry.listAllIds());
  }

  public delete(id: string): boolean {
    const registry = this.locate(id);

    if (registry === undefined) return false;

    return registry.delete(id);
  }

  public has(id: string): boolean {
    return this.locate(id) !== undefined;
  }

  public locate(id: string): Registry | undefined {
    for (const registry of [
      ...this.mainRegistry.getAllRegistries(),
      ...(this.parent?.mainRegistry.getAllRegistries() || []),
    ])
      if (registry.has(id)) return registry;
  }
}
