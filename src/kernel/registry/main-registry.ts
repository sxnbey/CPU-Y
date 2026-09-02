import { IRegistryMap } from "#kernel/contract/index";

export class MainRegistry {
  private registries: Partial<IRegistryMap> = {};

  public register<K extends keyof IRegistryMap>(
    key: K,
    registry: IRegistryMap[K],
  ): void {
    if (this.registries[key])
      throw new Error(`Registry "${key}" is already registered.`);

    this.registries[key] = registry;
  }

  public get<R extends keyof IRegistryMap>(registry: R): IRegistryMap[R] {
    const value = this.registries[registry];

    if (!value) throw new Error(`Registry "${registry}" does not exist.`);

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
