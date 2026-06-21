import "reflect-metadata";

export function InjectConfig(): Function {
  return (
    target: Object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    Reflect.defineMetadata("system:config", { index: parameterIndex }, target);
  };
}
