import type { Logger } from "#kernel/log/logger";
import type { Installer } from "#kernel/install/installer";
import type {
  Config,
  LoadedExport,
  Loader,
  RegistryEntry,
  Scope,
  SystemControl,
  Application,
} from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { MetadataKey } from "#contract";
import { hasOnStart, hasOnStop } from "#util";
import { getMetadata } from "#kernel/metadata/metadata-accessor";
import { LifecycleError } from "#kernel/error/errors";
import { token } from "#kernel/di/token";

type Layer = { resolver: RegistryResolver; entries: RegistryEntry<unknown>[] };

type Partition = {
  services: LoadedExport[];
  configs: Record<string, Config>;
};

export const SYSTEM_CONTROL = token<SystemControl>("systemControl");

export class System implements Application {
  private reloadable: Layer | undefined;
  private persistent: Layer | undefined;
  private readonly systemControl: SystemControl = { stop: () => this.stop() };

  constructor(
    private readonly dependencies: {
      newLayer: (parent: RegistryResolver) => RegistryResolver;
      logger: Logger;
      loader: Loader;
      installer: Installer;
      coreResolver: RegistryResolver;
      moduleExports: LoadedExport[];
    },
    private readonly options: {
      path?: string | URL;
      configs: Record<string, Config>;
    },
  ) {
    this.dependencies.coreResolver
      .getRegistry("instanceRegistry")
      .register({ id: SYSTEM_CONTROL, value: this.systemControl });
  }

  public async boot(): Promise<void> {
    if (this.reloadable !== undefined || this.persistent !== undefined)
      throw new LifecycleError({ errorCode: "ERR_ALREADY_BOOTED" });

    const { persistent, reloadable } = await this.collectServices(
      this.dependencies.moduleExports,
    );

    const persistentLayer = this.installLayer(
      persistent.services,
      persistent.configs,
      this.dependencies.coreResolver,
    );

    await this.startServices(persistentLayer.entries);

    try {
      const reloadableLayer = this.installLayer(
        reloadable.services,
        reloadable.configs,
        persistentLayer.resolver,
      );

      await this.startServices(reloadableLayer.entries);

      this.persistent = persistentLayer;
      this.reloadable = reloadableLayer;
    } catch (e) {
      await this.stopServices(persistentLayer.entries);

      throw e;
    }
  }

  public async stop(): Promise<void> {
    await this.stopServices(this.reloadable?.entries ?? []);
    await this.stopServices(this.persistent?.entries ?? []);

    this.reloadable = undefined;
    this.persistent = undefined;
  }

  private async collectServices(
    moduleExports: LoadedExport[],
  ): Promise<Record<Scope, Partition>> {
    const loadedServices = this.options.path
      ? await this.dependencies.loader(this.options.path)
      : [];

    const allServices = [...moduleExports, ...loadedServices];

    return splitByScope(allServices, this.options.configs);
  }

  private installLayer(
    exports: LoadedExport[],
    configs: Record<string, Config>,
    parent: RegistryResolver,
  ): Layer {
    const resolver = this.dependencies.newLayer(parent);
    const entries = this.dependencies.installer.install(
      exports,
      configs,
      resolver,
    );

    return { resolver, entries };
  }

  private async startServices(entries: Layer["entries"]) {
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

  private async stopServices(entries: Layer["entries"]): Promise<void> {
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

function splitByScope(
  services: LoadedExport[],
  configs: Record<string, Config>,
): Record<Scope, Partition> {
  const partitions: Record<Scope, Partition> = {
    persistent: { services: [], configs: {} },
    reloadable: { services: [], configs: {} },
  };
  const persistentIds = new Set<string>();

  for (const service of services) {
    if (typeof service.value !== "function") continue;

    const metadata = getMetadata(MetadataKey.METADATA, service.value);

    if (metadata === undefined) continue;

    const scope = metadata.scope ?? "reloadable";

    partitions[scope].services.push(service);

    if (scope === "persistent") persistentIds.add(metadata.id);
  }

  for (const [id, config] of Object.entries(configs))
    partitions[persistentIds.has(id) ? "persistent" : "reloadable"].configs[
      id
    ] = config;

  return partitions;
}
