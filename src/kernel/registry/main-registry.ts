import type { IRegistryMap } from "#kernel/contract/index";

import { RegistryError } from "#kernel/error/registry-error";

export class MainRegistry {
  private registries: Partial<IRegistryMap> = {};

  public register<K extends keyof IRegistryMap>(
    key: K,
    registry: IRegistryMap[K],
  ): void {
    if (this.registries[key])
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_ALREADY_REGISTERED",
        args: { name: key, origin: this.constructor.name },
      });

    this.registries[key] = registry;
  }

  public get<R extends keyof IRegistryMap>(registry: R): IRegistryMap[R] {
    const value = this.registries[registry];

    if (!value)
      throw new RegistryError({
        errorCode: "ERR_REGISTRY_NOT_FOUND",
        args: { name: registry, origin: this.constructor.name },
      });

    return value;
  }

  public has<R extends keyof IRegistryMap>(
    registry: R | string,
  ): registry is keyof IRegistryMap {
    return registry in this.registries;
  }

  public getAllRegistries<K extends keyof IRegistryMap>(): IRegistryMap[K][] {
    return Object.values(this.registries);
  }
}
