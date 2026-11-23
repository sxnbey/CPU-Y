import { MetadataKey, type BaseMetadata, type Token } from "#contract";

import { setMetadata } from "../metadata-accessor.js";

export function decorateFunction<
  Fn extends (...args: never[]) => unknown,
  Target extends Fn,
>(
  input: Pick<BaseMetadata, "scope"> & { id: Token<Fn> | string },
  targetFunction: Target,
): Target {
  setMetadata(
    MetadataKey.METADATA,
    { ...input, targetRegistry: "serviceRegistry" },
    targetFunction,
  );

  setMetadata(MetadataKey.KIND, "function", targetFunction);

  return targetFunction;
}
