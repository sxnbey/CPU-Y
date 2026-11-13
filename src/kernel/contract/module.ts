import type { EntryBuilder } from "./install.js";
import type { Registry } from "./registry.js";
import type { Constructor } from "./util.js";

export interface Module {
  name: string;
  registries?: RegistryDefinition[];
  services?: Record<string, unknown>;
}

export type RegistryDefinition = {
  registry: Constructor<Registry>;
  build: EntryBuilder;
};
