import { EventEmitter } from "node:events";

import { IRegistry, IRegistryMap } from "../contracts/interfaces";

export abstract class BaseRegistry<V, N extends keyof IRegistryMap>
  extends EventEmitter
  implements IRegistry<V, N>
{
  protected storage: Map<string, V>;

  constructor(protected readonly name: N) {
    super();

    this.storage = new Map();
  }

  public getName(): N {
    return this.name;
  }

  public register(id: string, value: V): V {
    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  public delete(id: string): this {
    this.storage.delete(id);

    this.emit("delete", id);

    return this;
  }

  public get(id: string): V | undefined {
    return this.storage.get(id);
  }

  public has(id: string): boolean {
    return this.storage.has(id);
  }
}
