import type { RegistryName } from "./registry.js";

export enum MetadataKey {
  CONFIG = "system:config",
  DEPENDENCIES = "system:dependencies",
  METADATA = "system:metadata",
}

export interface MetadataMap {
  [MetadataKey.CONFIG]: number;
  [MetadataKey.DEPENDENCIES]: Record<number, string>;
  [MetadataKey.METADATA]: BaseMetadata;
}

export interface BaseMetadata {
  id: string;
  targetRegistry: RegistryName;
}
