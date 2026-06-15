import { IMainRegistry, RegistryMap } from "./contracts";

import { MainRegistry } from "./registries/main-registry.class";

export class System {
  private registry: IMainRegistry;

  constructor() {
    this.registry = new MainRegistry();
  }

  public start(): boolean {
    // other soon

    console.log("packs in der bag");

    return true;
  }

  public connectRegistry<K extends keyof RegistryMap>(
    registry: RegistryMap[K],
  ): void {
    this.registry.register(registry.getName(), registry);
  }

  public register(): void {}
}
