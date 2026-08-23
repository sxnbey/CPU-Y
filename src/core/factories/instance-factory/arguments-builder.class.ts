import "reflect-metadata";

import { MetadataKeys } from "#kernel/contracts/types/metadata-keys.type";

import { BaseBlueprint } from "#kernel/blueprints/base-blueprint.class";
import { RegistryResolver } from "#kernel/registry-resolver.class";

export type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint<unknown>;

export class ArgumentsBuilder {
  public createArgumentsArray(
    registryResolver: RegistryResolver,
    target: BaseBlueprintChild,
    config?: Record<string, unknown>,
  ): any[] {
    const { configIndex, injectableParameters } =
      this.getParameterIndexes(target);
    const parameterCount = this.getParameterCount(
      configIndex,
      injectableParameters,
    );

    const argumentsArray: any[] = new Array(parameterCount);

    if (configIndex === undefined && config)
      throw new Error(
        `Unexpected configuration provided for blueprint ${target.name}. Configuration has to be marked with @Config.`,
      );

    for (let index = 0; index < parameterCount; index++) {
      const dependencyId = injectableParameters?.[index];

      if (dependencyId === undefined && index !== configIndex)
        throw new Error(
          `Missing dependency for parameter at index ${index} in blueprint ${target.name}. Please provide a dependency using @Inject or a configuration using @Config.`,
        );

      if (dependencyId) {
        const dependency = registryResolver.find(dependencyId);

        if (!dependency)
          throw new Error(
            `Dependency with id ${dependencyId} not found in the registry for blueprint ${target.name}.`,
          );

        argumentsArray[index] = dependency;
      } else if (index === configIndex && config)
        argumentsArray[index] = config;
      else if (index === configIndex && !config)
        throw new Error(
          `Missing configuration for parameter at index ${index} in blueprint ${target.name}. Please provide a configuration object.`,
        );
    }

    return argumentsArray;
  }

  private getParameterIndexes(target: BaseBlueprintChild): {
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

  private getParameterCount(
    configIndex: number | undefined,
    injectableParameters: Record<number, string>,
  ): number {
    const lengthFromConfigIndex =
      configIndex !== undefined ? configIndex + 1 : 0;
    const lengthFromInjectableParameters =
      Math.max(...Object.keys(injectableParameters).map(Number), -1) + 1;

    return Math.max(lengthFromConfigIndex, lengthFromInjectableParameters);
  }

  private getOwnOrInheritedMetadata<T>(
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
