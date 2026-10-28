import {
  MetadataKey,
  type BaseMetadata,
  type Config,
  type EntryBuilder,
  type LoadedExport,
  type RegistryName,
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
  private builderMap: Map<RegistryName, EntryBuilder> = new Map();

  constructor(private readonly registryResolver: RegistryResolver) {}

  public install(
    exports: LoadedExport[],
    configs: Record<string, Config>,
  ): void {
    const installables = this.validate(exports, configs);
    const sorted = this.order(installables);

    this.build(sorted, installables);
  }

  public addBuilder(registryName: RegistryName, builder: EntryBuilder): void {
    if (this.builderMap.has(registryName))
      throw new InstallError({
        errorCode: "ERR_BUILDER_ALREADY_REGISTERED",
        args: { name: registryName },
      });

    this.builderMap.set(registryName, builder);
  }

  private validate(
    exports: LoadedExport[],
    configs: Record<string, Config>,
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

      if (this.registryResolver.has(id))
        throw new InstallError({
          errorCode: "ERR_ID_ALREADY_REGISTERED",
          args: {
            id,
            name,
            file,
          },
        });

      const builder = this.builderMap.get(targetRegistry);

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

  private order(installables: Map<string, Installable>): string[] {
    const toSort: Record<string, unknown> = {};

    installables.forEach((entry, key) => (toSort[key] = entry.source));

    const doesExist = (id: string) => this.registryResolver.has(id);
    const infoById = (id: string) => {
      const installable = installables.get(id);

      return installable
        ? `"${id}" as "${installable.origin.name}" in "${installable.origin.file}"`
        : `"${id}"`;
    };

    const sorted = sort(toSort, { doesExist, infoById });

    return sorted;
  }

  private build(
    sorted: string[],
    installables: Map<string, Installable>,
  ): void {
    const installedIds: string[] = [];

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
          lookup: (dependencyId) => this.registryResolver.find(dependencyId),
        });

        this.registryResolver
          .getRegistry(installable.metadata.targetRegistry)
          .registerWrapped(entry);

        installedIds.push(id);
      } catch (e) {
        for (const installedId of [...installedIds].reverse())
          this.registryResolver.delete(installedId);

        throw new InstallError({
          errorCode: "ERR_BUILD_FAILED",
          args: {
            id,
            name: installable.origin.name,
            file: installable.origin.file,
            rolledback:
              installedIds.length > 0 ? installedIds.join(", ") : "none",
          },
          cause: e,
        });
      }
    }
  }
}
