export interface Registry {
  register(id: string, value: any): any;
  delete(id: string): this;
  get(id: string): any;
  has(id: string): boolean;
}
