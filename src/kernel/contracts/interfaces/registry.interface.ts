import { IBaseRegistry } from "./base-registry.interface";

export interface IRegistry<T> extends IBaseRegistry {
  register(id: string, value: T): T;
  delete(id: string): this;

  get(id: string): T | undefined;
  has(id: string): boolean;
}
