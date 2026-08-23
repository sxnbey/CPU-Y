export interface IRegistry<N> {
  listAll(): unknown[];
  get(id: string): unknown | undefined;
  has(id: string): boolean;

  register(id: string, value: unknown): unknown;
  delete(id: string): this;
  clear(): this;

  getName(): N;
}
