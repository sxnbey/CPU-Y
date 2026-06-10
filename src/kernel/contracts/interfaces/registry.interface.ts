export interface IRegistry<V, N> {
  getName(): N;

  register(id: string, value: V): V;
  delete(id: string): this;

  get(id: string): V | undefined;
  has(id: string): boolean;
}
