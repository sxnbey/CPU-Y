import { IMainRegistry } from "./contracts/IMainRegistry";

export class RegistryBridge {
  private registry: IMainRegistry | null = null;

  public setRegistry(registry: IMainRegistry): void {
    this.registry = registry;
  }

  public getRegistry(): IMainRegistry {
    if (!this.registry) throw new Error("Registry not set");

    return this.registry;
  }
}
