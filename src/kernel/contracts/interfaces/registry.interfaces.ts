import { IMetadata } from "../index.js";

export interface IRegistry<N, V> {
  getName(): N;

  register(id: string, value: V): V;
  delete(id: string): this;

  get(id: string): V | undefined;
  has(id: string): boolean;
}

export interface IRegistryPayloadMap {
  instanceRegistry: IMetadata;
}
