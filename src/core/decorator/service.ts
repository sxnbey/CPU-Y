import type { IRegistryMap } from "#kernel/contract/index";
import type { ServiceOptions } from "#core/contract/index";
import { MetadataKey } from "#core/contract/index";

import { setMetadata } from "#core/util/metadata";

const serviceRegistryName = "serviceRegistry" satisfies keyof IRegistryMap;

export function Service(metadata: ServiceOptions): ClassDecorator {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...metadata, targetRegistry: serviceRegistryName },
      target,
    );
  };
}
