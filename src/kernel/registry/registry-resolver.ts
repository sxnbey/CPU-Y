import type { KnownRegistries, Registry, RegistryName, Token } from "#contract";
import type { MainRegistry } from "./main-registry.js";

import { RegistryError } from "#kernel/error/errors";

export class RegistryResolver {
  constructor(
    private readonly mainRegistry: MainRegistry,
    private readonly parent?: RegistryResolver,
  ) {}

  public getRegistry<KnownRegistry extends keyof KnownRegistries>(
    registryName: KnownRegistry,
  ): KnownRegistries[KnownRegistry] {
    return this.mainRegistry.get(
      registryName,
    ) as KnownRegistries[KnownRegistry];
  }

  public hasRegistry(registryName: RegistryName): boolean {
    return this.mainRegistry.has(registryName);
  }

  public getAllRegistries(): Registry[] {
    return this.mainRegistry.getAllRegistries();
  }

  public get<T>(token: Token<T>): T;

  public get(id: string): unknown {
    const registry = this.locate(id);

    if (!registry)
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: id, origin: this.constructor.name },
      });

    return registry.get(id);
  }

  public find<T>(token: Token<T>): T | undefined;

  public find(id: string): unknown {
    return this.locate(id)?.get(id);
  }

  public listAllIds(): string[] {
    return this.mainRegistry
      .getAllRegistries()
      .flatMap((registry) => registry.listAllIds());
  }

  public delete(id: string): boolean {
    const registry = this.locateOwn(id);

    if (registry === undefined) return false;

    return registry.delete(id);
  }

  public has(id: string): boolean {
    return this.locate(id) !== undefined;
  }

  public locate(id: string): Registry | undefined {
    return this.locateOwn(id) || this.parent?.locate(id);
  }

  private locateOwn(id: string): Registry | undefined {
    return this.mainRegistry
      .getAllRegistries()
      .find((registry) => registry.has(id));
  }
}
