import { IBaseMetadata } from "./metadata.js";

export interface IRegistryMap {}

export interface IRegistryEntry<V, M extends IBaseMetadata = IBaseMetadata> {
  metadata: M;
  value: V;
}
