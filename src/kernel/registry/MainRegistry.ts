import { IMainRegistry } from "../contracts/IMainRegistry";
import { RegistryMap } from "../contracts/RegistryMap";

type RegistryMapValue = RegistryMap[keyof RegistryMap];

export class MainRegistry implements IMainRegistry {
  private registries = new Map<keyof RegistryMap, RegistryMapValue>();

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
