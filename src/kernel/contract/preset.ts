import type { Logger } from "#kernel/log/logger";
import type { LogStream } from "#kernel/log/stream";
import type { EntryBuilder } from "./install.js";
import type { Loader } from "./load.js";
import type { Registry } from "./registry.js";
import type { Constructor } from "./util.js";

export interface CorePreset {
  logStream: Constructor<LogStream>;
  logger: Constructor<Logger>;
  loader: Loader;
  registries: RegistryDefinition[];
}

export type CoreOverrides = Partial<CorePreset>;

export type RegistryDefinition = {
  registry: Constructor<Registry>;
  build: EntryBuilder;
};
