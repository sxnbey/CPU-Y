import { EventEmitter } from "node:events";
import { Registry } from "../interfaces/Registry";

interface RegistryOptions {
  name: string;
}

export abstract class BaseRegistry<T>
  extends EventEmitter
  implements Registry<T>
{
  protected storage: Map<string, T>;

  constructor(protected readonly options: RegistryOptions) {
    super();

    this.storage = new Map();
  }

  public getName(): string {
    return this.options.name;
  }

  public register(id: string, value: T): T {
    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  public delete(id: string): this {
    this.storage.delete(id);

    this.emit("delete", id);

    return this;
  }

  public get(id: string): T | undefined {
    return this.storage.get(id);
  }

  public has(id: string): boolean {
    return this.storage.has(id);
  }
}
