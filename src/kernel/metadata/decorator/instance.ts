import {
  MetadataKey,
  type BaseMetadata,
  type Constructor,
  type Token,
} from "#contract";

import { setMetadata } from "../metadata-accessor.js";

export function Instance<T>(
  input: Pick<BaseMetadata, "scope"> & { id: Token<T> | string },
): (target: Constructor<T>) => void {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...input, targetRegistry: "serviceRegistry" },
      target,
    );

    setMetadata(MetadataKey.KIND, "class", target);
  };
}
