import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";

export class System {
  constructor(
    private readonly mainRegistry: MainRegistry,
    private readonly registryResolver: RegistryResolver,
  ) {}

  public boot(): void {
    console.log("Hallo Welt!");
  }
}
