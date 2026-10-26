import type { EntryBuilder } from "#contract";

import { create } from "#kernel/di/instance-factory";
import { resolveDependencies } from "#kernel/di/dependency-resolver";
import { isClass, formatToString } from "#util";

export const buildInstance: EntryBuilder = ({
  source,
  metadata,
  lookup,
  config,
}) => {
  if (!isClass(source))
    throw new Error(`Source "${formatToString(source)}" is not a class.`);

  return create(
    source,
    metadata,
    (src, cfg) => resolveDependencies(src, lookup, cfg),
    config,
  );
};

export const buildFunction: EntryBuilder = ({ source, metadata }) => {
  if (typeof source !== "function")
    throw new Error(`Source "${formatToString(source)}" is not a function.`);

  return { value: source, metadata };
};
