import type { Config, CoreOverrides, Module } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { createLayer } from "#kernel/registry/create-registry-layer";
import { Installer } from "#kernel/install/installer";
import { collectExports } from "#kernel/load/loader";

import { CORE_PRESET } from "./core-preset.js";
import { System } from "./system.js";

type BootstrapOptions = {
  path: string | URL;
  configs?: Record<string, Config>;
  modules?: Module[];
  overrides?: CoreOverrides;
};

export function bootstrap(options: BootstrapOptions): System {
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
    .register({ id: "logStream", value: logStream });

  const logger = new preset.logger(logStream);

  core.registryResolver
    .getRegistry("instanceRegistry")
    .register({ id: "logger", value: logger });

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
