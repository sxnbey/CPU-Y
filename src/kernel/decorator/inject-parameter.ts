import { MetadataKey } from "#contract";

import { getMetadata, setMetadata } from "#kernel/metadata/accessor";
import { FrameworkError } from "#kernel/error/framework-error";

export function Inject(id: string): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new FrameworkError({
        errorCode: "ERR_INVALID_DECORATOR_TARGET",
        args: { decorator: "Inject" },
      });

    const existingDependencies: Record<number, string> =
      getMetadata(MetadataKey.DEPENDENCIES, target) || {};

    setMetadata(
      MetadataKey.DEPENDENCIES,
      { ...existingDependencies, [parameterIndex]: id },
      target,
    );
  };
}
