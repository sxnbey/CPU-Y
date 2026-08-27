import "reflect-metadata";

import { MetadataKeys } from "#core/contract/index";

import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";
import { RegistryResolver } from "#kernel/registry/registry-resolver";

export type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint<unknown>;

export class ArgumentBuilder {
  static createArgumentsArray(
    registryResolver: RegistryResolver,
    target: BaseBlueprintChild,
    config?: Record<string, unknown>,
  ): any[] {
    const { configIndex, injectableParameters } =
      ArgumentBuilder.getParameterIndexes(target);
    const parameterCount = ArgumentBuilder.getParameterCount(
      configIndex,
      injectableParameters,
    );

    const argumentsArray: any[] = new Array(parameterCount);

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

  private static getParameterIndexes(target: BaseBlueprintChild): {
    configIndex: number | undefined;
    injectableParameters: Record<number, string>;
  } {
    const configIndex = this.getOwnOrInheritedMetadata<number>(
      MetadataKeys.CONFIG,
      target,
    );
    const injectableParameters: Record<number, string> =
      this.getOwnOrInheritedMetadata(MetadataKeys.DEPENDENCIES, target) || {};

    return { configIndex, injectableParameters };
  }

  private static getParameterCount(
    configIndex: number | undefined,
    injectableParameters: Record<number, string>,
  ): number {
    const lengthFromConfigIndex =
      configIndex !== undefined ? configIndex + 1 : 0;
    const lengthFromInjectableParameters =
      Math.max(...Object.keys(injectableParameters).map(Number), -1) + 1;

    return Math.max(lengthFromConfigIndex, lengthFromInjectableParameters);
  }

  private static getOwnOrInheritedMetadata<T>(
    metadataKey: string,
    target: new (...args: any[]) => any,
  ): T | undefined {
    let currentTarget = target;

    while (currentTarget) {
      const metadata = Reflect.getOwnMetadata(metadataKey, currentTarget);

      if (metadata !== undefined) return metadata;

      currentTarget = Object.getPrototypeOf(currentTarget);
    }

    return undefined;
  }
}
