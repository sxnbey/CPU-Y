import { RegistryMap } from "#kernel/contracts/index";

import { MainRegistry } from "#kernel/registries/main-registry.class";

export class System {
  private registry: MainRegistry;

  constructor() {
    this.registry = new MainRegistry();
  }

  public start(): boolean {
    console.log("packs in der bag");

    return true;
  }

  public connectRegistry<K extends keyof RegistryMap>(
    registry: RegistryMap[K],
  ): void {
    this.registry.register(registry.getName(), registry);
  }
}
