import { RegistryMap } from "..";

export interface IMetadata {
  id: string;
  targetRegistry: keyof RegistryMap;
}
