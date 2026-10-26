import type { Registry, RegistryMap, RegistryName } from "#contract";

import { EventEmitter } from "node:events";
import { RegistryError } from "#kernel/error/errors";

export class MainRegistry extends EventEmitter {
  private registries: Map<RegistryName, Registry> = new Map();

  public register<N extends RegistryName>(
    registryName: N,
    registry: RegistryMap[N],
  ): void {
    if (this.registries.has(registryName))
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_ALREADY_REGISTERED",
        args: { name: registryName, origin: this.constructor.name },
      });

    this.registries.set(registryName, registry);

    registry.addListener("register", (id, entry) =>
      this.emit("register", registryName, id, entry),
    );

    this.emit("register", "MainRegistry", registryName, registry);
  }

  public get<R extends RegistryName>(registry: R): RegistryMap[R] {
    const value = this.registries.get(registry);

    if (!value)
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_NOT_FOUND",
        args: { name: registry, origin: this.constructor.name },
      });

    return value as RegistryMap[R];
  }

  public has(name: string): boolean {
    return this.registries.has(name);
  }

  public getAllRegistries(): Registry[] {
    return [...this.registries.values()];
  }
}
