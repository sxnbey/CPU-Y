import { type BaseMetadata, type RegistryEntry, MetadataKey } from "#contract";

import { isClass, isMetadata } from "#kernel/util/type-guards";
import { getMetadata } from "./metadata-accessor.js";
import { FactoryError } from "#kernel/error/errors";

type Class = new (...args: any[]) => unknown;

type Resolver = (arg0: Class, arg1?: Record<string, unknown>) => unknown[];

export function create<
  RawInstanceConfig extends BaseMetadata,
  Payload extends Record<string, unknown>,
>(
  resolve: Resolver,
  source: RawInstanceConfig,
  payload?: Payload,
): RegistryEntry<DynamicClass<Payload>>;

export function create<SourceClass extends Class>(
  resolve: Resolver,
  source: SourceClass,
  input?: Record<string, unknown>,
): RegistryEntry<SourceClass>;

export function create(
  resolve: Resolver,
  source: Class | BaseMetadata,
  input?: Record<string, unknown>,
): RegistryEntry<unknown> {
  if (isClass(source)) {
    const Class = source;
    const config = input;
    const metadata = getMetadata<BaseMetadata>(MetadataKey.METADATA, Class);

    if (!metadata)
      throw new FactoryError({
        errorCode: "ERR_MISSING_METADATA",
        args: { name: Class.name },
      });

    const constructorArgs = resolve(Class, config);
    const value = new Class(...constructorArgs);

    return { metadata, value };
  }

  if (isMetadata(source)) {
    const payload = input;
    const metadata = source;
    const value = new DynamicClass(payload);

    return { metadata, value };
  }

  throw new FactoryError({
    errorCode: "ERR_INVALID_SOURCE",
    args: { source },
  });
}

class DynamicClass<P extends Record<string, unknown> | undefined = undefined> {
  constructor(readonly payload?: P) {}
}
