import type { RegistryMap, Registry } from "#contract";

import { EventEmitter } from "node:events";
import { RegistryError } from "#kernel/error/errors";

export class MainRegistry extends EventEmitter {
  private registries: Partial<RegistryMap> = {};

  public register<K extends keyof RegistryMap>(
    key: K,
    registry: RegistryMap[K],
  ): void {
    if (this.registries[key])
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_ALREADY_REGISTERED",
        args: { name: key, origin: this.constructor.name },
      });

    this.registries[key] = registry;

    registry.addListener("register", (id, entry) =>
      this.emit("register", key, id, entry),
    );
  }

  public get<R extends keyof RegistryMap>(registry: R): RegistryMap[R] {
    const value = this.registries[registry];

    if (!value)
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_NOT_FOUND",
        args: { name: registry, origin: this.constructor.name },
      });

    return value;
  }

  public has<R extends keyof RegistryMap>(
    registry: R | string,
  ): registry is keyof RegistryMap {
    return registry in this.registries;
  }

  public getAllRegistries(): Registry<keyof RegistryMap>[] {
    return Object.values(this.registries);
  }
}
