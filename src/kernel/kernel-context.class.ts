import { IMainRegistry } from "./contracts/interfaces/main-registry.interface";
import { IRegistryMap } from "./contracts/interfaces/registry-map.interface";

export class KernelContext {
  constructor(private registryInstance: IMainRegistry) {}

  public get<K extends keyof IRegistryMap>(key: K): IRegistryMap[K] {
    return this.registryInstance.get(key);
  }
}
