import { IMainRegistry, IRegistryMap } from "./contracts/interfaces";

import { KernelContext } from "./kernel-context.class";
import { MainRegistry } from "./registries/main-registry.class";

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

  public connectRegistry<K extends keyof IRegistryMap>(
    registry: IRegistryMap[K],
  ): void {
    this.registry.register(registry.getName(), registry);
  }

  public register(): void {}
}
