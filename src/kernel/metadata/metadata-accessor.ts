import "reflect-metadata";

import type { MetadataKey, MetadataMap } from "#contract";

export function getMetadata<K extends MetadataKey>(
  metadataKey: K,
  target: object,
): MetadataMap[K] | undefined {
  return Reflect.getOwnMetadata(metadataKey, target);
}

export function setMetadata<K extends MetadataKey>(
  metadataKey: K,
  value: MetadataMap[K],
  target: object,
): void {
  Reflect.defineMetadata(metadataKey, value, target);
}
