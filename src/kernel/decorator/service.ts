import { type IRegistryMap, type ServiceConfig, MetadataKey } from "#contract";

import { setMetadata } from "#kernel/metadata/accessor";

const serviceRegistryName = "serviceRegistry" satisfies keyof IRegistryMap;

export function Service(config: ServiceConfig): ClassDecorator {
  return (target) => {
    setMetadata(
      MetadataKey.METADATA,
      { ...config, targetRegistry: serviceRegistryName },
      target,
    );
  };
}
