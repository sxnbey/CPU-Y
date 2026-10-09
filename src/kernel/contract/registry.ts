import type EventEmitter from "events";
import type { BaseMetadata } from "./metadata.js";

export interface Registry<
  N extends keyof KnownRegistries | string,
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
  instanceRegistry: RegistryEntry<
    InstanceType<new (...args: any[]) => any>,
    BaseMetadata
  >;
  functionRegistry: RegistryEntry<(...args: any[]) => any>;
}

export type KnownRegistries = {
  [R in keyof RegistryPayloadMap]: Registry<R, RegistryPayloadMap[R]>;
};

export type CustomRegistries = {
  [key: string]: Registry<string, any>;
};

export type RegistryMap = KnownRegistries & CustomRegistries;

export interface RegistryEntry<V, M extends BaseMetadata = BaseMetadata> {
  value: V;
  metadata: M;
}
