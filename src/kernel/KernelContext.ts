import { IMainRegistry } from "./contracts/IMainRegistry";
import { RegistryMap } from "./contracts/RegistryMap";

export class KernelContext {
  constructor(private registryInstance: IMainRegistry) {}

  public get<K extends keyof RegistryMap>(key: K): RegistryMap[K] {
    return this.registryInstance.get(key);
  }
}
