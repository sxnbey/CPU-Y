import {
  type CorePreset,
  type CoreOverrides,
  CORE_SERVICES_PRESET,
} from "./core-preset.js";
import type { Logger } from "#kernel/log/logger";

import { System } from "./system.js";

import { sort } from "#kernel/di/sorter";
import { resolveDependencies } from "#kernel/di/resolver";
import { isClass } from "#kernel/util/type-guards";

export function bootstrap(overrides: CoreOverrides = {}): System {
  const preset: CorePreset = { ...CORE_SERVICES_PRESET, ...overrides };
  const {
    registries,
    mainRegistry: MainRegistryClass,
    registryResolver: RegistryResolverClass,
    ...services
  } = preset;
  const mainRegistry = new MainRegistryClass();
  const registryResolver = new RegistryResolverClass(mainRegistry);

  console.log(`${logPrefix} building registries`);

  mainRegistry.addListener("register", (registry, id) =>
    console.log(`${logPrefix} entry "${id}" just registered in "${registry}"`),
  );

  registries.forEach((Registry) => {
    const registryInstance = new Registry();

    mainRegistry.register(registryInstance.getName() as any, registryInstance);
  });

  const instanceRegistry = registryResolver.get("instanceRegistry");
  const functionRegistry = registryResolver.get("functionRegistry");

  console.log(`${logPrefix} register services`);

  for (const [key, service] of Object.entries(services))
    if (!isClass(service))
      functionRegistry.register({ id: key, value: service });

  const sortedDependencies = sort(services);

  const search = (key: string) => registryResolver.find(key);

  for (const serviceName of sortedDependencies) {
    const service = services[serviceName as keyof typeof services];

    if (!isClass(service)) continue;

    const args = resolveDependencies(service, search);
    const instance = new (service as new (...args: any[]) => any)(...args);

    instanceRegistry.register({ id: serviceName, value: instance });
  }

  const logger = registryResolver.get<Logger>("logger");

  console.log(`${logPrefix} done`);
  console.log();

  return new System(mainRegistry, registryResolver, logger);
}

const logPrefix = "[bootstrap]";
