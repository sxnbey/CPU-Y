import { EventEmitter } from "node:events";
import { Registry } from "../interfaces/Registry";

export abstract class BaseRegistry extends EventEmitter implements Registry {
  protected storage: Map<string, any>;

  constructor() {
    super();

    this.storage = new Map();
  }

  register(id: string, value: any): any {
    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  delete(id: string): this {
    this.storage.delete(id);

    this.emit("delete", id);

    return this;
  }

  get(id: string): any {
    return this.storage.get(id);
  }

  has(id: string): boolean {
    return this.storage.has(id);
  }
}
