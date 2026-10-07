import type EventEmitter from "events";
import type { BaseMetadata } from "./metadata.js";

export interface Registry<
  N extends keyof RegistryMap,
  V extends RegistryEntry<unknown> = RegistryEntry<unknown>,
> extends EventEmitter {
  getName(): N;

  listAll(): V["value"][];
  listAllWrapped(): V[];

  get(id: string): V["value"];
  getWrapped(id: string): V;

  has(id: string): boolean;

  register({
    id,
    value,
    metadata,
  }: {
    id: string;
    value: V["value"];
    metadata?: Record<string, unknown>;
  }): V;
  registerWrapped(value: V): V;

  delete(id: string): boolean;
  clear(): this;
}

export interface RegistryPayloadMap {
  instanceRegistry: RegistryEntry<unknown, BaseMetadata>;
  functionRegistry: RegistryEntry<(...args: any[]) => any>;
}

export type RegistryMap = {
  [R in keyof RegistryPayloadMap]: Registry<R, RegistryPayloadMap[R]>;
};

export interface RegistryEntry<V, M extends BaseMetadata = BaseMetadata> {
  value: V;
  metadata: M;
}
