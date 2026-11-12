import type { Constructor, EntryBuilder, Loader, Registry } from "#contract";

import { Logger } from "#kernel/log/logger";
import {
  InstanceRegistry,
  FunctionRegistry,
} from "#kernel/registry/registries";
import { LogStream } from "#kernel/log/stream";
import { createLoader } from "#kernel/load/loader";
import { buildFunction, buildInstance } from "#kernel/install/entry-builders";

export const CORE_PRESET: CorePreset = {
  logStream: LogStream,
  logger: Logger,
  loader: createLoader(),
  registries: [
    { registry: InstanceRegistry, build: buildInstance },
    { registry: FunctionRegistry, build: buildFunction },
  ],
};

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
