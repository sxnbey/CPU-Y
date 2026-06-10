import { IMainRegistry } from "../contracts/interfaces/main-registry.interface";
import { IRegistryMap } from "../contracts/interfaces/registry-map.interface";

export class MainRegistry implements IMainRegistry {
  private registries = new Map<
    keyof IRegistryMap,
    IRegistryMap[keyof IRegistryMap]
  >();

  public register<K extends keyof IRegistryMap>(
    key: K,
    registry: IRegistryMap[K],
  ): void {
    this.registries.set(key, registry);
  }

  public get<K extends keyof IRegistryMap>(key: K): IRegistryMap[K] {
    return this.registries.get(key) as IRegistryMap[K];
  }
}
