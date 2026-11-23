import type { RegistryName } from "./registry.js";

export enum MetadataKey {
  CONFIG = "system:config",
  DEPENDENCIES = "system:dependencies",
  METADATA = "system:metadata",
  KIND = "system:kind",
}

export interface MetadataMap {
  [MetadataKey.CONFIG]: number;
  [MetadataKey.DEPENDENCIES]: Record<number, string>;
  [MetadataKey.METADATA]: BaseMetadata;
  [MetadataKey.KIND]: ServiceKind;
}

export type ServiceKind = "function" | "class" | "factory";

export interface BaseMetadata {
  id: string;
  targetRegistry: RegistryName;
  scope?: Scope;
}

export type Scope = "persistent" | "reloadable";
