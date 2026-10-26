import {
  MetadataKey,
  type BaseMetadata,
  type KnownRegistries,
} from "#contract";

import { setMetadata } from "../metadata-accessor.js";

const registryName = "functionRegistry" satisfies keyof KnownRegistries;

export function decorateFunction<T extends (...args: any[]) => unknown>(
  input: Pick<BaseMetadata, "id">,
  targetFunction: T,
): T {
  setMetadata(
    MetadataKey.METADATA,
    { ...input, targetRegistry: registryName },
    targetFunction,
  );

  return targetFunction;
}
