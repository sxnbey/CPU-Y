import { IBaseMetadata } from "./index.js";

export interface IRegistryMap {}

export interface IRegistryEntry<V> {
  metadata: IBaseMetadata;
  value: V;
}
