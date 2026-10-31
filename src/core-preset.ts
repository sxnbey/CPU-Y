import type { CorePreset } from "#contract";

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
