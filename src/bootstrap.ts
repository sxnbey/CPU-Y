import {
  type CorePreset,
  type CoreOverrides,
  CORE_SERVICES_PRESET,
} from "./core-preset.js";
import type { Config } from "#contract";

import { System } from "./system.js";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Installer } from "#kernel/install/installer";

type BootstrapOptions = {
  path: string;
  configs?: Record<string, Config>;
  overrides?: CoreOverrides;
};

export function bootstrap(options: BootstrapOptions) {
  console.log(`${logPrefix} starting...`);

  const preset: CorePreset = { ...CORE_SERVICES_PRESET, ...options.overrides };
  const {
    logStream: LogStreamClass,
    logger: LoggerClass,
    loader,
    registries,
  } = preset;
  const mainRegistry = new MainRegistry();
  const registryResolver = new RegistryResolver(mainRegistry);
  const installer = new Installer(registryResolver);

  const registrationLog = (registry: string, id: string) =>
    console.log(`${logPrefix} entry "${id}" just registered in "${registry}"`);

  mainRegistry.addListener("register", registrationLog);

  console.log(`${logPrefix} registering registries...`);

  registries.forEach((entry) => {
    const registry = new entry.registry();

    mainRegistry.register(registry.getName(), registry);

    installer.addBuilder(registry.getName(), entry.build);
  });

  const instanceRegistry = registryResolver.getRegistry("instanceRegistry");

  console.log(`${logPrefix} registering instances...`);

  const logStream = new LogStreamClass();

  instanceRegistry.register({ id: "logStream", value: logStream });

  const logger = new LoggerClass(logStream);

  instanceRegistry.register({ id: "logger", value: logger });

  console.log(`${logPrefix} registering functions...`);

  console.log(`${logPrefix} finishing up...`);

  console.log(`${logPrefix} done 😋`);
  console.log();

  mainRegistry.off("register", registrationLog);

  return new System(
    { logger, loader, installer, registryResolver },
    { path: options.path, configs: options.configs ?? {} },
  );
}

const logPrefix = "[bootstrap]";
