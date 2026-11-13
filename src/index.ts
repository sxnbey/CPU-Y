/************************************************************************************************\
*                                           STARTING                                             *
\************************************************************************************************/

export type { Application, SystemControl } from "#contract";
export { type BootstrapOptions, bootstrap } from "./bootstrap.js";

export { SYSTEM_CONTROL } from "./system.js";

/************************************************************************************************\
*                                       WRITING SERVICES                                         *
\************************************************************************************************/

export type {
  Token,
  Scope,
  Config as ServiceConfig,
  OnStart,
  OnStop,
  OnSnapshot,
  OnRestore,
} from "#contract";

export {
  Instance,
  Inject,
  Config,
  decorateFunction,
} from "#kernel/metadata/decorator/index";
export { token } from "#kernel/di/token";

/************************************************************************************************\
*                                         CORE SERVICES                                          *
\************************************************************************************************/

export type { LogPayload, Writer } from "#contract";

export { Logger, LOGGER } from "#kernel/log/logger";
export { LogStream, LOG_STREAM } from "#kernel/log/stream";

/************************************************************************************************\
*                                            ERROR                                               *
\************************************************************************************************/

export { FrameworkError } from "#kernel/error/framework-error";
export {
  DependencyInjectionError,
  RegistryError,
  LoadError,
  InstallError,
  DecoratorError,
  LifecycleError,
} from "#kernel/error/errors";

/************************************************************************************************\
*                                       WRITING MODULES                                          *
\************************************************************************************************/

export type { CoreOverrides } from "./core-preset.js";
export type {
  Module,
  BaseMetadata,
  Registry,
  RegistryEntry,
  RegistryName,
  RegistryPayloadMap,
  EntryBuilder,
  BuilderContext,
  KnownRegistries,
  RegistryDefinition,
} from "#contract";

export { BaseRegistry } from "#kernel/registry/base-registry";
export { getMetadata, setMetadata } from "#kernel/metadata/metadata-accessor";
export { registryToken } from "#kernel/registry/registry-token";
export { MetadataKey } from "#contract";
