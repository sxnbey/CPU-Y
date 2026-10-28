import { MetadataKey } from "#contract";

import { setMetadata, getInheritedMetadata } from "../metadata-accessor.js";
import { DecoratorError } from "#kernel/error/errors";
import { formatDecoratorTarget } from "#kernel/util/formatter";

export function Config(): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new DecoratorError({
        errorCode: "ERR_INVALID_DECORATOR_TARGET",
        args: { decorator: "Config" },
      });

    if (getInheritedMetadata(MetadataKey.CONFIG, target) !== undefined)
      throw new DecoratorError({
        errorCode: "ERR_DECORATOR_CAN_ONLY_BE_USED_ONCE",
        args: { decorator: "Config" },
      });

    const dependencies = getInheritedMetadata(MetadataKey.DEPENDENCIES, target);

    if (dependencies?.[parameterIndex] !== undefined)
      throw new DecoratorError({
        errorCode: "ERR_PARAMETER_INDEX_ALREADY_USED",
        args: {
          index: parameterIndex.toString(),
          target: formatDecoratorTarget(target),
          decorator: "Config",
        },
      });

    setMetadata(MetadataKey.CONFIG, parameterIndex, target);
  };
}
