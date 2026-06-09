import { IBaseRegistry } from "./contracts/interfaces/base-registry.interface";
import { IMainRegistry } from "./contracts/interfaces/main-registry.interface";
import { IRegistryMap } from "./contracts/interfaces/registry-map.interface";
import { RegistryMapValue } from "./contracts/types/registry-map-value.type";

import { KernelContext } from "./kernel-context.class";
import { MainRegistry } from "./registry/main-registry.class";

export class System {
  private registry: IMainRegistry;
  context: KernelContext;

  constructor() {
    this.registry = new MainRegistry();
    this.context = new KernelContext(this.registry);
  }

  public start(): boolean {
    // other soon

    console.log("packs in der bag");

    return true;
  }

  public connectRegistry(registry: IBaseRegistry): void {
    this.registry.register(
      registry.getName() as keyof IRegistryMap,
      registry as RegistryMapValue,
    );
  }
}
