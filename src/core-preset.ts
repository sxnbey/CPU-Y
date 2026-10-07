import type { Registry, RegistryMap } from "#contract";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Logger } from "#kernel/log/logger";
import {
  InstanceRegistry,
  FunctionRegistry,
} from "#kernel/registry/registries";
import { LogStream } from "#kernel/log/stream";
import { load } from "#kernel/loader";

export const CORE_SERVICES_PRESET = {
  mainRegistry: MainRegistry,
  registryResolver: RegistryResolver,
  logger: Logger,
  logStream: LogStream,
  loader: load,
  registries: [InstanceRegistry, FunctionRegistry],
} as const;

export type CorePreset = Omit<typeof CORE_SERVICES_PRESET, "registries"> & {
  readonly registries: readonly (new (
    ...args: any[]
  ) => Registry<keyof RegistryMap>)[];
};

export type CoreOverrides = Partial<CorePreset>;
