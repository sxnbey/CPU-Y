import type { Logger } from "#kernel/log/logger";
import type { MainRegistry } from "#kernel/registry/main-registry";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

// import { load } from "#kernel/loader";

export class System {
  constructor(
    readonly mainRegistry: MainRegistry,
    readonly registryResolver: RegistryResolver,
    readonly logger: Logger,
  ) {}

  public boot(): void {
    this.logger.info("system online fr");
  }
}
