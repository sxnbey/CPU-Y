import {
  MetadataKey,
  type BaseMetadata,
  type KnownRegistries,
} from "#contract";

import { setMetadata } from "../metadata-accessor.js";

const registryName = "instanceRegistry" satisfies keyof KnownRegistries;

export function Instance(input: Pick<BaseMetadata, "id">): ClassDecorator {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...input, targetRegistry: registryName },
      target,
    );
  };
}
