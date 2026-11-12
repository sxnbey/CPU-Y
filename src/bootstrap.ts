import type { Config, Module, Application } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { createLayer } from "#kernel/registry/create-registry-layer";
import { Installer } from "#kernel/install/installer";
import { collectExports } from "#kernel/load/loader";

import { CORE_PRESET, type CoreOverrides } from "./core-preset.js";
import { System } from "./system.js";
import { LOGGER } from "#kernel/log/logger";
import { LOG_STREAM } from "#kernel/log/stream";

type BootstrapOptions = {
  path: string | URL;
  configs?: Record<string, Config>;
  modules?: Module[];
  overrides?: CoreOverrides;
};

export function bootstrap(options: BootstrapOptions): Application {
  const preset = { ...CORE_PRESET, ...options.overrides };
  const registryDefinitions = [
    ...preset.registries,
    ...(options.modules ?? []).flatMap((module) => module.registries ?? []),
  ];
  const registries = registryDefinitions.map(
    (definition) => definition.registry,
  );

  const newLayer = (parent?: RegistryResolver) =>
    createLayer(registries, parent);

  const moduleExports = (options.modules ?? []).flatMap((module) => {
    const services = module.services ?? {};

    return collectExports(services, `module: ${module.name}`);
  });

  const core = newLayer();

  const installer = new Installer();

  for (const { registry, build } of registryDefinitions)
    installer.addBuilder(registry, build);

  const logStream = new preset.logStream();

  core.registryResolver
    .getRegistry("instanceRegistry")
    .register({ id: LOG_STREAM, value: logStream });

  const logger = new preset.logger(logStream);

  core.registryResolver
    .getRegistry("instanceRegistry")
    .register({ id: LOGGER, value: logger });

  return new System(
    {
      newLayer,
      logger,
      installer,
      loader: preset.loader,
      coreResolver: core.registryResolver,
      moduleExports,
    },
    { configs: options.configs ?? {}, path: options.path },
  );
}
