import { MetadataKey, type Config, type Lookup } from "#contract";

import { getMetadata } from "#kernel/metadata/metadata-accessor";
import { DependencyInjectionError } from "#kernel/error/errors";

type ParameterSlot = { kind: "dependency"; id: string } | { kind: "config" };

export function resolveDependencies(
  target: new (...args: any[]) => unknown,
  lookup: Lookup,
  config?: Config,
): unknown[] {
  const slots = readParameterSlots(target);
  const expectsConfig = slots.some((slot) => slot.kind === "config");

  if (config !== undefined && !expectsConfig)
    throw new DependencyInjectionError({
      errorCode: "ERR_UNEXPECTED_CONFIG",
      args: { name: target.name },
    });

  if (config === undefined && expectsConfig)
    throw new DependencyInjectionError({
      errorCode: "ERR_MISSING_CONFIG",
      args: { name: target.name },
    });

  return slots.map((slot) =>
    slot.kind === "config" ? config : lookupOrThrow(slot.id, lookup, target),
  );
}

export function readParameterSlots(
  target: new (...args: any[]) => unknown,
): ParameterSlot[] {
  const slots: ParameterSlot[] = [];
  const { configIndex, dependencies } = getParameterMetadata(target);
  const parameterCount = getParameterCount(configIndex, dependencies, target);

  for (let index = 0; index < parameterCount; index++) {
    if (index === configIndex) {
      slots.push({ kind: "config" });

      continue;
    }

    const id = dependencies[index];

    if (id !== undefined) {
      slots.push({
        kind: "dependency",
        id,
      });

      continue;
    }

    throw new DependencyInjectionError({
      errorCode: "ERR_MISSING_DEPENDENCY_DECORATOR",
      args: { index: index.toString(), name: target.name },
    });
  }

  return slots;
}

function getParameterMetadata(target: new (...args: any[]) => unknown): {
  configIndex: number | undefined;
  dependencies: Record<number, string>;
} {
  const configIndex = getMetadata(MetadataKey.CONFIG, target);
  const dependencies = getMetadata(MetadataKey.DEPENDENCIES, target) || {};

  return { configIndex, dependencies };
}

function getParameterCount(
  configIndex: number | undefined,
  dependencies: Record<number, string>,
  target: new (...args: any[]) => unknown,
): number {
  const lengthFromConfigIndex = configIndex !== undefined ? configIndex + 1 : 0;
  const lengthFromDependencies =
    Math.max(...Object.keys(dependencies).map(Number), -1) + 1;

  return Math.max(lengthFromConfigIndex, lengthFromDependencies, target.length);
}

function lookupOrThrow(
  dependencyId: string,
  lookup: Lookup,
  target: new (...args: any[]) => unknown,
): unknown {
  const dependency = lookup(dependencyId);

  if (dependency === undefined)
    throw new DependencyInjectionError({
      errorCode: "ERR_DEPENDENCY_NOT_FOUND",
      args: { id: dependencyId, name: target.name },
    });

  return dependency;
}
