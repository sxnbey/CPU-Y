import "reflect-metadata";

export function Config(): Function {
  return (
    target: Object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    Reflect.defineMetadata("system:config", { index: parameterIndex }, target);
  };
}
