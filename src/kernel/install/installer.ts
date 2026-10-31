import {
  MetadataKey,
  type BaseMetadata,
  type Config,
  type EntryBuilder,
  type LoadedExport,
  type Registry,
  type Constructor,
  type RegistryEntry,
} from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { getMetadata } from "#kernel/metadata/metadata-accessor";
import { sort } from "#kernel/di/sorter";
import { isClass } from "#util";
import { expectsConfig } from "#kernel/di/dependency-resolver";
import { InstallError } from "#kernel/error/errors";

type Installable = {
  source: unknown;
  metadata: BaseMetadata;
  builder: EntryBuilder;
  origin: Pick<LoadedExport, "name" | "file">;
  config: Config | undefined;
};

export class Installer {
  private builderMap: Map<Constructor<Registry>, EntryBuilder> = new Map();

  public install(
    exports: LoadedExport[],
    configs: Record<string, Config>,
    registryResolver: RegistryResolver,
  ): RegistryEntry<unknown>[] {
    const installables = this.validate(exports, configs, registryResolver);
    const sorted = this.order(installables, registryResolver);
    const installedIds = this.build(sorted, installables, registryResolver);

    return installedIds;
  }

  public addBuilder(
    registry: Constructor<Registry>,
    builder: EntryBuilder,
  ): void {
    if (this.builderMap.has(registry))
      throw new InstallError({
        errorCode: "ERR_BUILDER_ALREADY_REGISTERED",
        args: { name: registry.name },
      });

    this.builderMap.set(registry, builder);
  }

  private validate(
    exports: LoadedExport[],
    configs: Record<string, Config>,
    registryResolver: RegistryResolver,
  ): Map<string, Installable> {
    const installables: Map<string, Installable> = new Map();

    for (const { value: source, name, file } of exports) {
      if (typeof source !== "function") continue;

      const metadata = getMetadata(MetadataKey.METADATA, source);

      if (metadata === undefined) continue;

      const { id, targetRegistry } = metadata;

      const existing = installables.get(id);

      if (existing !== undefined)
        throw new InstallError({
          errorCode: "ERR_DUPLICATE_ID",
          args: {
            id,
            name,
            file,
            existingname: existing.origin.name,
            existingfile: existing.origin.file,
          },
        });

      if (registryResolver.has(id))
        throw new InstallError({
          errorCode: "ERR_ID_ALREADY_REGISTERED",
          args: {
            id,
            name,
            file,
          },
        });

      const registry = registryResolver.getRegistry(targetRegistry);
      const builder = this.builderMap.get(
        registry.constructor as Constructor<Registry>,
      );

      if (builder === undefined)
        throw new InstallError({
          errorCode: "ERR_MISSING_BUILDER",
          args: { registryname: targetRegistry, name, file },
        });

      const config = configs[id];
      const targetExpectsConfig = isClass(source) && expectsConfig(source);

      if (config === undefined && targetExpectsConfig)
        throw new InstallError({
          errorCode: "ERR_MISSING_CONFIG",
          args: {
            id,
            name,
            file,
          },
        });

      if (config !== undefined && !targetExpectsConfig)
        throw new InstallError({
          errorCode: "ERR_UNEXPECTED_CONFIG",
          args: {
            id,
            name,
            file,
          },
        });

      installables.set(id, {
        source,
        metadata,
        builder,
        config,
        origin: { name, file },
      });
    }

    for (const key of Object.keys(configs))
      if (!installables.has(key))
        throw new InstallError({
          errorCode: "ERR_UNRESOLVABLE_CONFIG",
          args: {
            id: key,
          },
        });

    return installables;
  }

  private order(
    installables: Map<string, Installable>,
    registryResolver: RegistryResolver,
  ): string[] {
    const toSort: Record<string, unknown> = {};

    for (const [serviceId, service] of installables)
      toSort[serviceId] = service.source;

    const doesExist = (id: string) => registryResolver.has(id);
    const infoById = (id: string) => {
      const installable = installables.get(id);

      return installable === undefined
        ? `"${id}"`
        : `"${id}" as "${installable.origin.name}" in "${installable.origin.file}"`;
    };

    const sorted = sort(toSort, { doesExist, infoById });

    return sorted;
  }

  private build(
    sorted: string[],
    installables: Map<string, Installable>,
    registryResolver: RegistryResolver,
  ): RegistryEntry<unknown>[] {
    const installedServices: { id: string; entry: RegistryEntry<unknown> }[] =
      [];

    for (const id of sorted) {
      const installable = installables.get(id);

      if (installable === undefined)
        throw new InstallError({
          errorCode: "ERR_UNKNOWN_ID",
          args: {
            id,
          },
        });

      try {
        const entry = installable.builder({
          source: installable.source,
          metadata: installable.metadata,
          config: installable.config,
          lookup: (dependencyId) => registryResolver.find(dependencyId),
        });

        registryResolver
          .getRegistry(installable.metadata.targetRegistry)
          .registerWrapped(entry);

        installedServices.push({ id, entry });
      } catch (e) {
        for (const { id: installedId } of [...installedServices].reverse())
          registryResolver.delete(installedId);

        throw new InstallError({
          errorCode: "ERR_BUILD_FAILED",
          args: {
            id,
            name: installable.origin.name,
            file: installable.origin.file,
            rolledback:
              installedServices.length > 0
                ? installedServices.map(({ id }) => id).join(", ")
                : "none",
          },
          cause: e,
        });
      }
    }

    return installedServices.map(({ entry }) => entry);
  }
}
