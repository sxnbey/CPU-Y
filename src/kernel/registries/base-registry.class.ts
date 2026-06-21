import { EventEmitter } from "node:events";

import { IRegistry, IRegistryPayloadMap, RegistryMap } from "../contracts";

export abstract class BaseRegistry<
  N extends keyof RegistryMap,
  V = IRegistryPayloadMap[N],
>
  extends EventEmitter
  implements IRegistry<N, V>
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
