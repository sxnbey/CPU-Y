import type { Logger } from "#kernel/log/logger";
import type { Installer } from "#kernel/install/installer";
import type { Config, Loader, RegistryEntry } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";
import type { RegistryLayer } from "#kernel/registry/create-registry-layer";

import { hasOnStart, hasOnStop } from "#util";
import { LifecycleError } from "#kernel/error/errors";

type App = { layer: RegistryLayer; entries: RegistryEntry<unknown>[] };

export class System {
  private app: App | undefined;

  constructor(
    private readonly dependencies: {
      newLayer: (parent: RegistryResolver) => RegistryLayer;
      logger: Logger;
      loader: Loader;
      installer: Installer;
      coreResolver: RegistryResolver;
    },
    private readonly options: {
      path: string;
      configs: Record<string, Config>;
    },
  ) {}

  public async boot(): Promise<void> {
    if (this.app !== undefined)
      throw new LifecycleError({ errorCode: "ERR_ALREADY_BOOTED" });

    const app = await this.createApp();

    await this.startServices(app.entries);

    this.app = app;
  }

  public async stop(): Promise<void> {
    await this.stopServices(this.app?.entries ?? []);

    this.app = undefined;
  }

  private async createApp(): Promise<App> {
    const { loader, newLayer, coreResolver, installer } = this.dependencies;
    const layer = newLayer(coreResolver);
    const exports = await loader(this.options.path);

    const entries = installer.install(
      exports,
      this.options.configs,
      layer.registryResolver,
    );

    return {
      layer,
      entries,
    };
  }

  private async startServices(entries: App["entries"]) {
    const startedServices: typeof entries = [];

    for (const entry of entries) {
      try {
        if (hasOnStart(entry.value)) await entry.value.onStart();
      } catch (e) {
        await this.stopServices(startedServices);

        throw new LifecycleError({
          errorCode: "ERR_START_FAILED",
          args: {
            id: entry.metadata.id,
            stopped:
              startedServices.length > 0
                ? startedServices
                    .map((service) => service.metadata.id)
                    .join(", ")
                : "none",
          },
          cause: e,
        });
      }

      startedServices.push(entry);
    }
  }

  private async stopServices(entries: App["entries"]): Promise<void> {
    for (const entry of [...entries].reverse())
      try {
        if (hasOnStop(entry.value)) await entry.value.onStop();
      } catch (e) {
        this.dependencies.logger.error(
          new LifecycleError({
            errorCode: "ERR_STOP_FAILED",
            args: { id: entry.metadata.id },
            cause: e,
          }),
        );
      }
  }
}
