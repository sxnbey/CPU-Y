export interface IRegistry<T> {
  getName(): string;

  register(id: string, value: T): T;
  delete(id: string): this;
  get(id: string): T | undefined;
  has(id: string): boolean;
}
