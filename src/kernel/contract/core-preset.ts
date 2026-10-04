import type { Registry, RegistryMap } from "./registry.js";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Logger } from "#kernel/log/logger";
import { create } from "#kernel/di/instance-factory";
import { InstanceRegistry } from "#kernel/registry/registries";
import { LogStream } from "#kernel/log/stream";

export const CORE_SERVICES_PRESET = {
  mainRegistry: MainRegistry,
  registryResolver: RegistryResolver,
  logger: Logger,
  logStream: LogStream,
  factoryCreate: create,
  registries: [InstanceRegistry],
} as const;

export type CorePreset = Omit<typeof CORE_SERVICES_PRESET, "registries"> & {
  readonly registries: (new (...args: any[]) => Registry<keyof RegistryMap>)[];
};

export type CoreOverrides = Partial<CorePreset>;
