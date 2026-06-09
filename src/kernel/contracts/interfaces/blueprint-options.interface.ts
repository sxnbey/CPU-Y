import { IRegistryMap } from "./registry-map.interface";

export interface IBlueprintOptions {
  id: string;
  targetLocation: keyof IRegistryMap;
}
