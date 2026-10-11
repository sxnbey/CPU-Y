import { MetadataKey, type BaseMetadata, type RegistryMap } from "#contract";

import { setMetadata } from "../metadata-accessor.js";

const registryName = "instanceRegistry" satisfies keyof RegistryMap;

export function Instance(input: Pick<BaseMetadata, "id">): ClassDecorator {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...input, targetRegistry: registryName },
      target,
    );
  };
}
