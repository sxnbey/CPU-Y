import { MetadataKey } from "#contract";

import { setMetadata, getInheritedMetadata } from "../metadata-accessor.js";
import { DecoratorError } from "#kernel/error/errors";
import { formatDecoratorTarget } from "#kernel/util/formatter";

export function Inject(id: string): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new DecoratorError({
        errorCode: "ERR_INVALID_DECORATOR_TARGET",
        args: { decorator: "Inject" },
      });

    const existingDependencies: Record<number, string> =
      getInheritedMetadata(MetadataKey.DEPENDENCIES, target) || {};

    const config = getInheritedMetadata(MetadataKey.CONFIG, target);

    if (
      config === parameterIndex ||
      existingDependencies[parameterIndex] !== undefined
    )
      throw new DecoratorError({
        errorCode: "ERR_PARAMETER_INDEX_ALREADY_USED",
        args: {
          index: parameterIndex.toString(),
          target: formatDecoratorTarget(target),
          decorator: "Inject",
        },
      });

    setMetadata(
      MetadataKey.DEPENDENCIES,
      { ...existingDependencies, [parameterIndex]: id },
      target,
    );
  };
}
