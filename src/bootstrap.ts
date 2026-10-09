import {
  type CorePreset,
  type CoreOverrides,
  CORE_SERVICES_PRESET,
} from "./core-preset.js";

import { System } from "./system.js";

export function bootstrap(overrides?: CoreOverrides) {
  console.log(`${logPrefix} starting...`);

  const preset: CorePreset = { ...CORE_SERVICES_PRESET, ...overrides };
  const {
    mainRegistry: MainRegistryClass,
    registryResolver: RegistryResolverClass,
    logStream: LogStreamClass,
    logger: LoggerClass,
    loader: loader,
    registries,
  } = preset;
  const mainRegistry = new MainRegistryClass();
  const registryResolver = new RegistryResolverClass(mainRegistry);

  mainRegistry.addListener("register", (registry, id) =>
    console.log(`${logPrefix} entry "${id}" just registered in "${registry}"`),
  );

  console.log(`${logPrefix} registering registries`);

  registries.forEach((Registry) => {
    const registryInstance = new Registry();

    mainRegistry.register(registryInstance.getName(), registryInstance);
  });

  const instanceRegistry = registryResolver.getRegistry("instanceRegistry");
  const functionRegistry = registryResolver.getRegistry("functionRegistry");

  console.log(`${logPrefix} registering instances`);

  const logStream = new LogStreamClass();

  instanceRegistry.register({ id: "logStream", value: logStream });

  const logger = new LoggerClass(logStream);

  instanceRegistry.register({ id: "logger", value: logger });

  console.log(`${logPrefix} registering functions`);

  functionRegistry.register({ id: "loader", value: loader });

  console.log(`${logPrefix} done 😋`);
  console.log();

  return new System(mainRegistry, registryResolver, logger);
}

const logPrefix = "[bootstrap]";
