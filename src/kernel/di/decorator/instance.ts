import {
  type RegistryMap,
  type InstanceMetadata,
  MetadataKey,
} from "#contract";

import { setMetadata } from "../metadata-accessor.js";

type MetadataInput = Pick<InstanceMetadata, "id">;

const registryName = "instanceRegistry" satisfies keyof RegistryMap;

export function Instance(input: MetadataInput): ClassDecorator {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...input, targetRegistry: registryName },
      target,
    );
  };
}
