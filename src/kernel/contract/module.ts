import type { RegistryDefinition } from "./preset.js";

export interface Module {
  name: string;
  registries?: RegistryDefinition[];
  services?: Record<string, unknown>;
}
