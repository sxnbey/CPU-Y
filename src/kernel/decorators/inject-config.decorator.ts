import "reflect-metadata";

export function Config(): ParameterDecorator {
  return (
    target: Object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new Error(
        `@Config decorator can only be used on constructor parameters, not on method parameters.`,
      );

    Reflect.defineMetadata("system:config", { index: parameterIndex }, target);
  };
}
