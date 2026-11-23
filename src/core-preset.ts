import type { Constructor, Loader, RegistryDefinition } from "#contract";

import { Logger } from "#kernel/log/logger";
import { ServiceRegistry } from "#kernel/registry/service-registry";
import { LogStream } from "#kernel/log/stream";
import { createLoader } from "#kernel/load/loader";
import { buildFunction, buildInstance } from "#kernel/install/entry-builders";

export const CORE_PRESET: CorePreset = {
  logStream: LogStream,
  logger: Logger,
  loader: createLoader(),
  registries: [{ registry: ServiceRegistry, build: buildInstance }],
};

export interface CorePreset {
  logStream: Constructor<LogStream>;
  logger: Constructor<Logger>;
  loader: Loader;
  registries: RegistryDefinition[];
}

export type CoreOverrides = Partial<Omit<CorePreset, "registries">>;
