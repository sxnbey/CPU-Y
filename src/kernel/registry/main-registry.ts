import type { RegistryMap, RegistryName } from "#contract";

import { EventEmitter } from "node:events";
import { RegistryError } from "#kernel/error/errors";

export class MainRegistry extends EventEmitter {
  private registries: RegistryMap = {} as RegistryMap;

  public register<N extends RegistryName>(
    registryName: N,
    registry: RegistryMap[N],
  ): void {
    if (this.registries[registryName])
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_ALREADY_REGISTERED",
        args: { name: registryName, origin: this.constructor.name },
      });

    this.registries[registryName] = registry;

    registry.addListener("register", (id, entry) =>
      this.emit("register", registryName, id, entry),
    );

    this.emit("register", "MainRegistry", registryName, registry);
  }

  public get<R extends RegistryName>(registry: R): RegistryMap[R] {
    const value = this.registries[registry];

    if (!value)
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_NOT_FOUND",
        args: { name: registry, origin: this.constructor.name },
      });

    return value;
  }

  public has<R extends RegistryName>(
    registry: R | string,
  ): registry is RegistryName {
    return registry in this.registries;
  }

  public getAllRegistries(): RegistryMap[keyof RegistryMap][] {
    return Object.values(this.registries);
  }
}
