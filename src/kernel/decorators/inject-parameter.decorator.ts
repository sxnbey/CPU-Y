import "reflect-metadata";

export function Inject(id: string): Function {
  return (
    target: Object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    const existingDependencies: string[] =
      Reflect.getOwnMetadata("system:dependencies", target) || [];
    const dependencies = [...existingDependencies];

    dependencies[parameterIndex] = id;

    Reflect.defineMetadata("system:dependencies", dependencies, target);
  };
}
