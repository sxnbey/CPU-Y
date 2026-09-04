import { MetadataKey } from "#core/contract/index";

import { getMetadata, setMetadata } from "#core/util/metadata";

export function Inject(id: string): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new Error(
        `@Inject decorator can only be used on constructor parameters, not on method parameters.`,
      );

    const existingDependencies: Record<number, string> =
      getMetadata(MetadataKey.DEPENDENCIES, target) || {};

    setMetadata(
      MetadataKey.DEPENDENCIES,
      { ...existingDependencies, [parameterIndex]: id },
      target,
    );
  };
}
