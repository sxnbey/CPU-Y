import type { KnownRegistries } from "./registry.js";

export enum MetadataKey {
  CONFIG = "system:config",
  DEPENDENCIES = "system:dependencies",
  METADATA = "system:metadata",
}

export interface BaseMetadata {
  id: string;
  targetRegistry: keyof KnownRegistries;
}
