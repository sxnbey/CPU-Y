import type { Logger } from "#kernel/log/logger";
import type { Installer } from "#kernel/install/installer";
import type { Config, Loader } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

export class System {
  constructor(
    private readonly dependencies: {
      logger: Logger;
      loader: Loader;
      installer: Installer;
      registryResolver: RegistryResolver;
    },
    private readonly options: {
      path: string;
      configs: Record<string, Config>;
    },
  ) {}

  public async boot(): Promise<void> {
    const exports = await this.dependencies.loader(this.options.path);
    this.dependencies.installer.install(exports, this.options.configs);

    this.dependencies.logger.info(
      `registered: ${this.dependencies.registryResolver.listAllIds().join(", ")}`,
    );
  }
}
