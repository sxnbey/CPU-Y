import type { CorePreset, CoreOverrides } from "#contract";

import { System } from "./system.js";

import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Logger } from "#kernel/log/logger";
import { create } from "#kernel/di/instance-factory";
import { LogStream } from "#kernel/log/stream";
import {
  InstanceRegistry,
  FunctionRegistry,
} from "#kernel/registry/registries";

import { getMetadata } from "#kernel/di/metadata-accessor";
import { resolveDependencies } from "#kernel/di/resolver";
import { MetadataKey } from "#contract";
import { isClass } from "#kernel/util/type-guards";

const corePreset: CorePreset = {
  mainRegistry: MainRegistry,
  registryResolver: RegistryResolver,
  logger: Logger,
  logStream: LogStream,
  factoryCreate: create,
  registries: [InstanceRegistry, FunctionRegistry],
};

export function bootstrap(overrides: CoreOverrides = {}): System {
  const preset: CorePreset = { ...corePreset, ...overrides };
  const {
    registries,
    mainRegistry: MainRegistryClass,
    registryResolver: RegistryResolverClass,
    ...services
  } = preset;
  const mainRegistry = new MainRegistryClass();
  const registryResolver = new RegistryResolverClass(mainRegistry);

  mainRegistry.addListener("register", (registry, id) =>
    console.log(
      `entry with id "${id}" just registered in registry "${registry}"`,
    ),
  );

  registries.forEach((Registry) => {
    const registryInstance = new Registry();

    mainRegistry.register(registryInstance.getName() as any, registryInstance);
  });

  const instanceRegistry = registryResolver.get("instanceRegistry");
  const functionRegistry = registryResolver.get("functionRegistry");

  for (const [key, service] of Object.entries(services))
    if (!isClass(service))
      functionRegistry.register({ id: key, value: service });

  const dependencyMap = buildDependencyMap(services);
  const sortedByDependencies = topoSort(dependencyMap);

  const search = (key: string) => registryResolver.find(key);

  for (const serviceName of sortedByDependencies) {
    const service = services[serviceName as keyof typeof services];

    if (!isClass(service)) continue;

    const args = resolveDependencies(search, service);
    const instance = new (service as new (...args: any[]) => any)(...args);

    instanceRegistry.register({ id: serviceName, value: instance });
  }

  const logger = registryResolver.get<Logger>("logger");

  return new System(mainRegistry, registryResolver, logger);
}

function buildDependencyMap(services: Record<string, unknown>): {
  [key: string]: string[];
} {
  const dependencyMap: { [key: string]: string[] } = {};

  for (const [key, service] of Object.entries(services)) {
    dependencyMap[key] ??= [];

    const currentDeps = dependencyMap[key];

    if (!isClass(service)) continue;

    const metadata = getMetadata(MetadataKey.DEPENDENCIES, service);

    if (metadata)
      Object.values(metadata).forEach((dep) => currentDeps.push(dep));
  }

  return dependencyMap;
}

function topoSort(dependencyMap: { [key: string]: string[] }): string[] {
  const state: { [key: string]: "unvisited" | "visiting" | "visited" } = {};
  const sorted: string[] = [];

  function visit(current: string, path: string[]) {
    const currentState = state[current] || "unvisited";

    if (currentState === "visiting")
      throw new Error(
        `Circular dependency detected for "${current}"\nPath: ${[...path, current].join(" -> ")}`,
      );

    if (currentState === "unvisited") {
      state[current] = "visiting";

      const dependencies = dependencyMap[current];

      if (!dependencies)
        throw new Error(
          `Dependency "${current}" not found in the dependency map.\nPath: ${[...path, current].join(" -> ")}`,
        );

      dependencies.forEach((dep) => visit(dep, [...path, current]));

      state[current] = "visited";

      sorted.push(current);
    }
  }

  for (const key of Object.keys(dependencyMap)) if (!state[key]) visit(key, []);

  return sorted;
}
