import "reflect-metadata";

export function getMetadata<T>(
  metadataKey: string,
  target: object,
): T | undefined {
  return Reflect.getOwnMetadata(metadataKey, target);
}

export function setMetadata(
  metadataKey: string,
  value: unknown,
  target: object,
) {
  Reflect.defineMetadata(metadataKey, value, target);
}
