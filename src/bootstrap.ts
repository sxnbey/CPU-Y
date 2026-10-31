import type { Config, CoreOverrides } from "#contract";
import type { RegistryResolver } from "#kernel/registry/registry-resolver";

import { createLayer } from "#kernel/registry/create-registry-layer";
import { Installer } from "#kernel/install/installer";

import { CORE_PRESET } from "./core-preset.js";
import { System } from "./system.js";

type BootstrapOptions = {
  path: string;
  configs?: Record<string, Config>;
  overrides?: CoreOverrides;
};

export function bootstrap(options: BootstrapOptions): System {
  const preset = { ...CORE_PRESET, ...options.overrides };
  const registries = preset.registries.map(({ registry }) => registry);
  const core = createLayer(registries);

  const installer = new Installer();

  for (const { registry, build } of preset.registries)
    installer.addBuilder(registry, build);

  const newLayer = (parent?: RegistryResolver) =>
    createLayer(registries, parent);

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
    },
    { configs: options.configs ?? {}, path: options.path },
  );
}
