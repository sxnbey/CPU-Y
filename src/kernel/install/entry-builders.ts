import type { EntryBuilder } from "#contract";

import { create } from "#kernel/di/instance-factory";
import { resolveDependencies } from "#kernel/di/dependency-resolver";
import { isClass, formatToString } from "#util";
import { InstallError } from "#kernel/error/errors";

export const buildInstance: EntryBuilder = ({
  source,
  metadata,
  lookup,
  config,
}) => {
  if (!isClass(source))
    throw new InstallError({
      errorCode: "ERR_SOURCE_IS_NOT_CLASS",
      args: { source: formatToString(source) },
    });

  return create(
    source,
    metadata,
    (src, cfg) => resolveDependencies(src, lookup, cfg),
    config,
  );
};

export const buildFunction: EntryBuilder = ({ source, metadata }) => {
  if (typeof source !== "function")
    throw new InstallError({
      errorCode: "ERR_SOURCE_IS_NOT_FUNCTION",
      args: { source: formatToString(source) },
    });

  return { value: source, metadata };
};
