import type { IRegistryMap } from "./registry.js";

export interface IBaseMetadata {
  id: string;
  targetRegistry: keyof IRegistryMap;
}

export interface IServiceMetadata extends IBaseMetadata {}
