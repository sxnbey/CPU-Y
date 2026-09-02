import { MetadataKeys } from "#core/contract/index";

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
      getMetadata(MetadataKeys.DEPENDENCIES, target) || {};

    setMetadata(
      MetadataKeys.DEPENDENCIES,
      { ...existingDependencies, [parameterIndex]: id },
      target,
    );
  };
}
