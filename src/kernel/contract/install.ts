import type { BaseMetadata } from "./metadata.js";
import type { RegistryEntry } from "./registry.js";

export type Lookup = (id: string) => unknown;

export type BuilderContext = {
  source: unknown;
  metadata: BaseMetadata;
  lookup: Lookup;
  config: Config | undefined;
};

export type EntryBuilder = (context: BuilderContext) => RegistryEntry<unknown>;

export type Config = Record<string, unknown>;
