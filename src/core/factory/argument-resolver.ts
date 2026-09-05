import type { BaseBlueprintChild } from "#core/contract/index";
import { MetadataKey } from "#core/contract/index";

import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { getMetadata } from "#core/util/metadata";

export function resolveArguments(
  registryResolver: RegistryResolver,
  target: BaseBlueprintChild,
  config?: Record<string, unknown>,
): unknown[] {
  const { configIndex, injectableParameters } = getParameterIndexes(target);
  const parameterCount = getParameterCount(configIndex, injectableParameters);

  const argumentsArray: unknown[] = new Array(parameterCount);

  if (configIndex === undefined && config)
    throw new Error(
      `Unexpected configuration provided for blueprint "${target.name}". Configuration has to be marked with @Config.`,
    );

  for (let index = 0; index < parameterCount; index++) {
    const dependencyId = injectableParameters?.[index];

    if (index === configIndex) {
      if (!config)
        throw new Error(
          `Missing configuration for parameter at index ${index} in blueprint "${target.name}". Please provide a configuration object.`,
        );

      argumentsArray[index] = config;

      continue;
    }

    if (dependencyId === undefined)
      throw new Error(
        `Missing dependency for parameter at index ${index} in blueprint "${target.name}". Please provide a dependency using @Inject or a configuration using @Config.`,
      );

    const dependency = registryResolver.find(dependencyId);

    if (!dependency)
      throw new Error(
        `Dependency with id ${dependencyId} not found in the registry for blueprint "${target.name}".`,
      );

    argumentsArray[index] = dependency;
  }

  return argumentsArray;
}

function getParameterIndexes(target: BaseBlueprintChild): {
  configIndex: number | undefined;
  injectableParameters: Record<number, string>;
} {
  const configIndex = getMetadata<number>(MetadataKey.CONFIG, target);
  const injectableParameters: Record<number, string> =
    getMetadata<Record<number, string>>(MetadataKey.DEPENDENCIES, target) || {};

  return { configIndex, injectableParameters };
}

function getParameterCount(
  configIndex: number | undefined,
  injectableParameters: Record<number, string>,
): number {
  const lengthFromConfigIndex = configIndex !== undefined ? configIndex + 1 : 0;
  const lengthFromInjectableParameters =
    Math.max(...Object.keys(injectableParameters).map(Number), -1) + 1;

  return Math.max(lengthFromConfigIndex, lengthFromInjectableParameters);
}
