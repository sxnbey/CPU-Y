import "reflect-metadata";

export function Inject(id: string): ParameterDecorator {
  return (
    target: Object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (_propertyKey !== undefined)
      throw new Error(
        `@Inject decorator can only be used on constructor parameters, not on method parameters.`,
      );

    const existingDependencies: Record<number, string> =
      Reflect.getOwnMetadata("system:dependencies", target) || {};

    Reflect.defineMetadata(
      "system:dependencies",
      { ...existingDependencies, [parameterIndex]: id },
      target,
    );
  };
}
