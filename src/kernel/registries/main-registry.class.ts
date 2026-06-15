import { IMainRegistry, RegistryMap } from "../contracts";

export class MainRegistry implements IMainRegistry {
  private registries = new Map<
    keyof RegistryMap,
    RegistryMap[keyof RegistryMap]
  >();

  // tuple als mapped type über registrymap

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
