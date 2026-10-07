import { MetadataKey } from "#contract";
import { isClass } from "#util";
import { getMetadata } from "#kernel/metadata/metadata-accessor";

type Lookup = (args0: string) => boolean;

export function sort(
  services: Record<string, unknown>,
  lookup?: Lookup,
): string[] {
  const dependencyMap = buildDependencyMap(services);
  const sorted = topologicalSort(dependencyMap, lookup);

  return sorted;
}

function buildDependencyMap(services: Record<string, unknown>): {
  [key: string]: string[];
} {
  const dependencyMap: { [key: string]: string[] } = {};

  for (const [key, service] of Object.entries(services)) {
    dependencyMap[key] ??= [];

    const currentDeps = dependencyMap[key];

    if (!isClass(service)) continue;

    const metadata = getMetadata(MetadataKey.DEPENDENCIES, service);

    if (metadata)
      Object.values(metadata).forEach((dep) => currentDeps.push(dep));
  }

  return dependencyMap;
}

function topologicalSort(
  dependencyMap: { [key: string]: string[] },
  lookup?: Lookup,
): string[] {
  const state: { [key: string]: "unvisited" | "visiting" | "visited" } = {};
  const sorted: string[] = [];

  for (const key of Object.keys(dependencyMap)) if (!state[key]) visit(key, []);

  return sorted;

  //

  function visit(current: string, path: string[]) {
    const currentState = state[current] || "unvisited";

    if (currentState === "visiting")
      throw new Error(
        `Circular dependency detected for "${current}"\nPath: ${[...path, current].join(" -> ")}`,
      );

    if (currentState === "unvisited") {
      state[current] = "visiting";

      const dependencies = dependencyMap[current];

      if (dependencies === undefined) {
        if (lookup?.(current)) {
          state[current] = "visited";

          return;
        }

        throw new Error(
          `Dependency "${current}" not found in the dependency map.\nPath: ${[...path, current].join(" -> ")}`,
        );
      }

      dependencies.forEach((dep) => visit(dep, [...path, current]));

      state[current] = "visited";

      sorted.push(current);
    }
  }
}
