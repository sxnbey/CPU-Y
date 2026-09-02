import { IRegistryMap } from "./registry.js";

export interface IBaseMetadata {
  id: string;
  targetRegistry: keyof IRegistryMap;
}
