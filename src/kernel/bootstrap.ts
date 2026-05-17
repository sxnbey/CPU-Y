import { IMainRegistry } from "./contracts/IMainRegistry";

import { BlueprintFactory } from "./BlueprintFactory";
import { RegistryBridge } from "./RegistryBridge";
import { MainRegistry } from "./registry/MainRegistry";
import { ProcessRegistry } from "./registry/ProcessRegistry";
import { BlueprintRegistry } from "./registry/BlueprintRegistry";

interface ISystem {
  start(): boolean;
}

export class CPUY implements ISystem {
  registry: IMainRegistry;
  factory: BlueprintFactory;

  constructor() {
    this.registry = new MainRegistry();
    this.createRegistries();

    this.factory = new BlueprintFactory(this.createRegistryBridge());
  }

  public start(): boolean {
    // other soon

    console.log("packs in der bag");

    return true;
  }

  private createRegistries(): void {
    const allRegistries = [new ProcessRegistry(), new BlueprintRegistry()];

    allRegistries.forEach((registry) => {
      this.registry.register(registry.getName(), registry);
    });
  }

  private createRegistryBridge(): RegistryBridge {
    const registryBridge = new RegistryBridge();

    registryBridge.setRegistry(this.registry);

    return registryBridge;
  }
}
