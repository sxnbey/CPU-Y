import { RegistryMap } from "../contracts/index.js";

export class MainRegistry {
  private registries: Partial<RegistryMap> = {};

  public register<K extends keyof RegistryMap>(
    key: K,
    registry: RegistryMap[K],
  ): void {
    this.registries[key] = registry;
  }

  public get<R extends keyof RegistryMap>(registry: R): RegistryMap[R] {
    const value = this.registries[registry];

    if (!value) throw new Error(`Registry "${registry}" does not exist.`);

    return value;
  }

  public has<R extends keyof RegistryMap>(
    registry: R | string,
  ): registry is keyof RegistryMap {
    return registry in this.registries;
  }

  public getAllRegistries<K extends keyof RegistryMap>(): RegistryMap[K][] {
    return Object.values(this.registries);
  }
}
