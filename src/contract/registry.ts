import type { IBaseMetadata, IServiceMetadata } from "./metadata.js";

export interface IRegistry<
  N extends keyof IRegistryMap,
  V extends IRegistryEntry<unknown>,
> {
  getName(): N;

  listAll(): V["value"][];
  listAllWrapped(): V[];

  get(id: string): V["value"];
  getWrapped(id: string): V;

  has(id: string): boolean;

  register(
    id: string,
    value: V["value"],
    optionalMetadata?: Record<string, unknown>,
  ): V;
  registerWrapped(value: V): V;

  delete(id: string): boolean;
  clear(): this;
}

export interface IRegistryPayloadMap {
  serviceRegistry: IRegistryEntry<unknown, IServiceMetadata>;
}

export type IRegistryMap = {
  [R in keyof IRegistryPayloadMap]: IRegistry<R, IRegistryPayloadMap[R]>;
};

export interface IRegistryEntry<V, M extends IBaseMetadata = IBaseMetadata> {
  metadata: M;
  value: V;
}
