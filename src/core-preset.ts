import type { RegistryMap } from "#contract";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Logger } from "#kernel/log/logger";
import {
  InstanceRegistry,
  FunctionRegistry,
} from "#kernel/registry/registries";
import { LogStream } from "#kernel/log/stream";
import { load } from "#kernel/loader";

type Constructor<T> = new (...args: any[]) => T;

export interface CorePreset {
  mainRegistry: Constructor<MainRegistry>;
  registryResolver: Constructor<RegistryResolver>;
  logStream: Constructor<LogStream>;
  logger: Constructor<Logger>;
  loader: typeof load;
  registries: (new (...args: any[]) => RegistryMap[keyof RegistryMap])[];
}

export const CORE_SERVICES_PRESET: CorePreset = {
  mainRegistry: MainRegistry,
  registryResolver: RegistryResolver,
  logStream: LogStream,
  logger: Logger,
  loader: load,
  registries: [InstanceRegistry, FunctionRegistry],
};

export type CoreOverrides = Partial<CorePreset>;
