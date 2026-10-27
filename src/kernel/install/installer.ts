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
import { readParameterSlots } from "#kernel/di/dependency-resolver";

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
      throw new Error(
        `Builder for registry "${registryName}" has already been added.`,
      );

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
        throw new Error(
          `Duplicate id "${id}": exported as "${name}" in "${file}" and as "${existing.origin.name}" in "${existing.origin.file}". Ids must be unique.`,
        );

      if (this.registryResolver.has(id))
        throw new Error(
          `Id "${id}" as "${name}" in "${file}" is already registered. Ids must be unique.`,
        );

      const builder = this.builderMap.get(targetRegistry);

      if (builder === undefined)
        throw new Error(
          `No builder exists for registry "${targetRegistry}". Used by "${name}" in "${file}".`,
        );

      const config = configs[id];
      const expectsConfig =
        isClass(source) &&
        readParameterSlots(source).some((slot) => slot.kind === "config");

      if (config === undefined && expectsConfig)
        throw new Error(
          `Export with id "${id}" as "${name}" in "${file}" requires a configuration, but none was provided. Pass it via bootstrap({ configs: { ${id}: { yourConfig } } }).`,
        );

      if (config !== undefined && !expectsConfig)
        throw new Error(
          `Export with id "${id}" as "${name}" in "${file}" has no @Config decorator, but a configuration was provided.`,
        );

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
        throw new Error(
          `Config for "${key}" was provided, but no matching export with id "${key}" is being installed.`,
        );

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
    for (const id of sorted) {
      const installable = installables.get(id);

      if (installable === undefined)
        throw new Error(`Sorter returned unknown id "${id}".`);

      const entry = installable.builder({
        source: installable.source,
        metadata: installable.metadata,
        config: installable.config,
        lookup: (dependencyId) => this.registryResolver.find(dependencyId),
      });

      this.registryResolver
        .getRegistry(installable.metadata.targetRegistry)
        .registerWrapped(entry);
    }
  }
}
