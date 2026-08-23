import { IRegistryMap } from "./index.js";

export interface IBaseMetadata {
  id: string;
  targetRegistry: keyof IRegistryMap;
}
