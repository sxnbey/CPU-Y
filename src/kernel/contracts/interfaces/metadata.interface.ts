import { RegistryMap } from "../index.js";

export interface IMetadata {
  id: string;
  targetRegistry: keyof RegistryMap;
}
