import type { Logger } from "#kernel/log/logger";
import type { MainRegistry } from "#kernel/registry/main-registry";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

export class System {
  constructor(
    readonly mainRegistry: MainRegistry,
    readonly registryResolver: RegistryResolver,
    readonly logger: Logger,
  ) {}

  public boot(): void {
    this.logger.info("system online fr");
    this.logger.info("ich logge sachen");
    this.logger.info("ich logge sven 😋");
  }
}
