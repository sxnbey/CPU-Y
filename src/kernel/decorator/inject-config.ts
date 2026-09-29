import { MetadataKey } from "#contract";

import { setMetadata, getMetadata } from "#kernel/metadata/accessor";
import { FrameworkError } from "#kernel/error/framework-error";

export function Config(): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new FrameworkError({
        errorCode: "ERR_INVALID_DECORATOR_TARGET",
        args: { decorator: "Config" },
      });

    if (getMetadata(MetadataKey.CONFIG, target) !== undefined)
      throw new FrameworkError({
        errorCode: "ERR_DECORATOR_CAN_ONLY_BE_USED_ONCE",
        args: { decorator: "Config" },
      });

    setMetadata(MetadataKey.CONFIG, parameterIndex, target);
  };
}
