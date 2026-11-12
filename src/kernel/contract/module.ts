import type { RegistryDefinition } from "../../core-preset.js";

export interface Module {
  name: string;
  registries?: RegistryDefinition[];
  services?: Record<string, unknown>;
}
