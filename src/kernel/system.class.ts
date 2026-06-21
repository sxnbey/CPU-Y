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

  public find<K extends keyof RegistryMap>(target: K): RegistryMap[K];

  public find(target: string): any;

  public find(target: string): any {
    if (this.registry.has(target)) return this.registry.get(target);

    return this.registry
      .getAllRegistries()
      .find((registry) => registry.has(target))
      ?.get(target);
  }
}
