import { MetadataKey, type BaseMetadata, type RegistryEntry } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { getMetadata } from "#kernel/metadata/metadata-accessor";

export type EntryBuilder = (importedFile: unknown) => RegistryEntry<unknown>;

const allBuilder: Map<string, EntryBuilder> = new Map();

export function install(imports: unknown[], resolver: RegistryResolver): void {
  for (const importedFile of imports) {
    if (typeof importedFile !== "function") continue;

    const metadata = getMetadata<BaseMetadata>(
      MetadataKey.METADATA,
      importedFile,
    );
    const targetRegistry = metadata?.targetRegistry;

    if (!targetRegistry)
      throw new Error("exported member does not have metadata");

    const build = allBuilder.get(targetRegistry);

    if (!build)
      throw new Error(
        `no entry builder for registry "${targetRegistry}" exists`,
      );

    const entry = build(importedFile);

    resolver.getRegistry(targetRegistry).registerWrapped(entry);
  }
}

export function addBuilder(builder: EntryBuilder): void {
  allBuilder.set(builder.name, builder);
}
