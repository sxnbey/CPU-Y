import { IMainRegistry, IRegistryMap } from "./contracts/interfaces";

export class KernelContext {
  constructor(private registryInstance: IMainRegistry) {}

  public UNSAFE_getRegistry<K extends keyof IRegistryMap>(
    key: K,
  ): IRegistryMap[K] {
    return this.registryInstance.get(key);
  }
}
