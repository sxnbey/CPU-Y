import type { EntryBuilder, Loader, Registry } from "#contract";

import { Logger } from "#kernel/log/logger";
import {
  InstanceRegistry,
  FunctionRegistry,
} from "#kernel/registry/registries";
import { LogStream } from "#kernel/log/stream";
import { createLoader } from "#kernel/load/loader";
import { buildFunction, buildInstance } from "#kernel/install/entry-builders";

type Constructor<T> = new (...args: any[]) => T;

export interface CorePreset {
  logStream: Constructor<LogStream>;
  logger: Constructor<Logger>;
  loader: Loader;
  registries: { registry: Constructor<Registry>; build: EntryBuilder }[];
}

export const CORE_SERVICES_PRESET: CorePreset = {
  logStream: LogStream,
  logger: Logger,
  loader: createLoader(),
  registries: [
    { registry: InstanceRegistry, build: buildInstance },
    { registry: FunctionRegistry, build: buildFunction },
  ],
};

export type CoreOverrides = Partial<CorePreset>;
