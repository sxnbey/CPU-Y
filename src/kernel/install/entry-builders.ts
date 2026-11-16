import type { EntryBuilder } from "#contract";

import { create } from "#kernel/di/instance-factory";
import {
  resolveDependencies,
  hasDependencies,
} from "#kernel/di/dependency-resolver";
import { isClass, formatToString, isPlainFunction } from "#util";
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

export const buildFunction: EntryBuilder = ({
  source,
  metadata,
  lookup,
  config,
}) => {
  if (!isPlainFunction(source))
    throw new InstallError({
      errorCode: "ERR_SOURCE_IS_NOT_FUNCTION",
      args: { source: formatToString(source) },
    });

  if (!hasDependencies(source)) return { value: source, metadata };

  const deps = resolveDependencies(source, lookup, config);
  const result = source(...deps);

  if (!isPlainFunction(result))
    throw new InstallError({
      errorCode: "ERR_RETURN_VALUE_OF_FACTORY_IS_NOT_FUNCTION",
      args: { result: formatToString(result) },
    });

  return { value: result, metadata };
};
