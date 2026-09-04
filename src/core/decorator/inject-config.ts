import { MetadataKey } from "#core/contract/index";

import { setMetadata, getMetadata } from "#core/util/metadata";

export function Config(): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new Error(
        `@Config decorator can only be used on constructor parameters, not on method parameters.`,
      );

    if (getMetadata(MetadataKey.CONFIG, target) !== undefined)
      throw new Error(
        `@Config decorator can only be used once per constructor.`,
      );

    setMetadata(MetadataKey.CONFIG, parameterIndex, target);
  };
}
