import { IMainRegistry } from "./contracts/IMainRegistry";
import { RegistryMap } from "./contracts/RegistryMap";

export class RegistryBridge {
  private registryInstance?: IMainRegistry;

  public setRegistry(registry: IMainRegistry): void {
    this.registryInstance = registry;
  }

  public get<K extends keyof RegistryMap>(key: K): RegistryMap[K] {
    if (!this.registryInstance)
      throw new Error("RegistryBridge: Registry not set yet");

    return this.registryInstance.get(key);
  }
}
