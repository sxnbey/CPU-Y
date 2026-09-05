import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { RegistryError } from "#kernel/error/registry-error";

export class System {
  constructor(
    private readonly mainRegistry: MainRegistry,
    private readonly registryResolver: RegistryResolver,
  ) {}

  public boot(): void {
    console.log("Hallo Welt!");

    throw new RegistryError({
      errorCode: "ERR_REGISTRY_NOT_FOUND",
      args: {
        name: "Test",
        origin: "System",
      },
    });
  }
}
