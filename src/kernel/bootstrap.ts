import { IMainRegistry } from "./contracts/IMainRegistry";

import { KernelContext } from "./KernelContext";

import { MainRegistry } from "./registry/MainRegistry";
import { ProcessRegistry } from "./registry/ProcessRegistry";
import { BlueprintRegistry } from "./registry/BlueprintRegistry";

interface ICPUY {
  start(): boolean;
}

export class CPUY implements ICPUY {
  private registry: IMainRegistry;
  context: KernelContext;

  constructor() {
    this.registry = new MainRegistry();
    this.createRegistries();

    this.context = new KernelContext(this.registry);
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
}
