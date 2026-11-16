import {
  MetadataKey,
  type BaseMetadata,
  type Token,
  type TokenValues,
} from "#contract";

import { setMetadata } from "../metadata-accessor.js";

// A tuple ensures the types don't collapse into a union.

type Dependencies = [Token<unknown>, ...Token<unknown>[]];

export function decorateFactory<
  Fn extends (...args: never[]) => unknown,
  Deps extends Dependencies,
  Factory extends (...deps: TokenValues<Deps>) => Fn,
>(
  input: Pick<BaseMetadata, "scope"> & {
    id: Token<Fn> | string;
    deps: [...Deps];
  },
  factory: Factory,
): Factory {
  const { deps, ...rest } = input;

  setMetadata(MetadataKey.DEPENDENCIES, deps, factory);

  setMetadata(
    MetadataKey.METADATA,
    { ...rest, targetRegistry: "functionRegistry" },
    factory,
  );

  return factory;
}
