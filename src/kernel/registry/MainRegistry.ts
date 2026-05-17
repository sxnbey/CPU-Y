import { IMainRegistry } from "../contracts/IMainRegistry";
import { RegistryMap } from "../contracts/RegistryMap";

export class MainRegistry implements IMainRegistry {
  private registries: Map<keyof RegistryMap, RegistryMap[keyof RegistryMap]>;

  constructor() {
    this.registries = new Map();
  }

  public register<K extends keyof RegistryMap>(
    key: K,
    registry: RegistryMap[K],
  ): void {
    this.registries.set(key, registry);
  }

  public get<K extends keyof RegistryMap>(key: K): RegistryMap[K] {
    return this.registries.get(key) as RegistryMap[K];
  }
}
