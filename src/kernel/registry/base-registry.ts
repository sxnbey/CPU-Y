import { EventEmitter } from "node:events";

import { IRegistry, IRegistryMap } from "../contract/index.js";

export abstract class BaseRegistry<N extends keyof IRegistryMap, V = unknown>
  extends EventEmitter
  implements IRegistry<N>
{
  protected name: N;
  protected storage: Map<string, V>;

  constructor() {
    super();

    const constructor = this.constructor as unknown as { registryName: N };

    if (!constructor.registryName)
      throw new Error(
        `Registry ${this.constructor.name} must define a static "registryName".`,
      );

    this.name = constructor.registryName;
    this.storage = new Map();
  }

  abstract listAll(): unknown[];

  public get(id: string): V | unknown | undefined {
    return this.storage.get(id);
  }

  public has(id: string): boolean {
    return this.storage.has(id);
  }

  public register(id: string, value: V): V {
    if (this.storage.has(id))
      throw new Error(`Entry with id "${id}" is already registered.`);

    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  public delete(id: string): this {
    this.storage.delete(id);

    this.emit("delete", id);

    return this;
  }

  public clear(): this {
    this.storage.clear();

    return this;
  }

  public getName(): N {
    return this.name;
  }
}
