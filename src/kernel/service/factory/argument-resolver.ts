import { type BaseBlueprintChild, MetadataKey } from "#contract";

import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { getMetadata } from "#kernel/metadata/accessor";
import { FactoryError } from "#kernel/error/factory-error";

export function resolveArgs(
  registryResolver: RegistryResolver,
  target: BaseBlueprintChild,
  config?: Record<string, unknown>,
): unknown[] {
  const { configIndex, injectableParameters } = getParameterIndexes(target);
  const parameterCount = getParameterCount(configIndex, injectableParameters);

  const argsArray: unknown[] = new Array(parameterCount);

  if (configIndex === undefined && config)
    throw new FactoryError({
      errorCode: "ERR_UNEXPECTED_CONFIG",
      args: { name: target.name },
    });

  for (let index = 0; index < parameterCount; index++) {
    const dependencyId = injectableParameters?.[index];

    if (index === configIndex) {
      if (!config)
        throw new FactoryError({
          errorCode: "ERR_MISSING_CONFIG",
          args: { index: index.toString(), name: target.name },
        });

      argsArray[index] = config;

      continue;
    }

    if (dependencyId === undefined)
      throw new FactoryError({
        errorCode: "ERR_MISSING_DEPENDENCY_DECORATOR",
        args: { index: index.toString(), name: target.name },
      });

    const dependency = registryResolver.find(dependencyId);

    if (!dependency)
      throw new FactoryError({
        errorCode: "ERR_DEPENDENCY_NOT_FOUND",
        args: { id: dependencyId, index: index.toString(), name: target.name },
      });

    argsArray[index] = dependency;
  }

  return argsArray;
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
