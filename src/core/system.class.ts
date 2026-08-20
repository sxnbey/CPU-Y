import { RegistryMap, IRegistry } from "#kernel/contracts/index";

import { MainRegistry } from "#kernel/registries/main-registry.class";
import { InstanceRegistry } from "#core/registries/instance-registry.class";

export class System {
  private registry = new MainRegistry();
  private registryArray: (new (...args: any) => IRegistry<unknown, unknown>)[] =
    [InstanceRegistry];

  public boot(): void {
    //! nächste baustelle
  }

  public connectRegistry<K extends keyof RegistryMap>(
    registry: RegistryMap[K],
  ): void {
    this.registry.register(registry.getName(), registry);
  }

  private initializeRegistries(): void {
    this.registryArray.forEach((RegistryClass) => {
      const registryInstance = new RegistryClass();

      this.connectRegistry(registryInstance as RegistryMap[keyof RegistryMap]);
    });
  }
}
