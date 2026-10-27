import { isClass } from "#util";
import { readParameterSlots } from "./dependency-resolver.js";
import { DependencyInjectionError } from "#kernel/error/errors";

type DoesExist = (id: string) => boolean;

type InfoById = (id: string) => string;

export function sort(
  services: Record<string, unknown>,
  { doesExist, infoById }: { doesExist?: DoesExist; infoById?: InfoById } = {},
): string[] {
  const dependencyMap = buildDependencyMap(services);
  const sorted = topologicalSort(dependencyMap, doesExist, infoById);

  return sorted;
}

function buildDependencyMap(services: Record<string, unknown>): {
  [serviceId: string]: string[];
} {
  const dependencyMap: { [serviceId: string]: string[] } = {};

  for (const [serviceId, service] of Object.entries(services)) {
    dependencyMap[serviceId] ??= [];

    const currentDeps = dependencyMap[serviceId];

    if (!isClass(service)) continue;

    for (const slot of readParameterSlots(service))
      if (slot.kind === "dependency") currentDeps.push(slot.id);
  }

  return dependencyMap;
}

function topologicalSort(
  dependencyMap: { [serviceId: string]: string[] },
  doesExist?: DoesExist,
  infoById: InfoById = (id) => `"${id}"`,
): string[] {
  const state: { [serviceId: string]: "unvisited" | "visiting" | "visited" } =
    {};
  const sorted: string[] = [];

  for (const serviceId of Object.keys(dependencyMap))
    if (!state[serviceId]) visit(serviceId, []);

  return sorted;

  //

  function visit(current: string, path: string[]) {
    const currentState = state[current] || "unvisited";

    if (currentState === "visiting") {
      const start = path.indexOf(current);
      const circle = [...path.slice(start), current];

      throw new DependencyInjectionError({
        errorCode: "ERR_CIRCULAR_DEPENDENCY_DETECTED",
        args: { path: circle.map(infoById).join("\n-> "), service: current },
      });
    }

    if (currentState === "unvisited") {
      state[current] = "visiting";

      const dependencies = dependencyMap[current];

      if (dependencies === undefined) {
        if (doesExist?.(current)) {
          state[current] = "visited";

          return;
        }

        // Cast is needed because path is never empty at this point.

        const service = infoById(path.at(-1) as string);

        throw new DependencyInjectionError({
          errorCode: "ERR_UNKNOWN_DEPENDENCY",
          args: {
            dependency: current,
            path: [...path, current].join(" -> "),
            service,
          },
        });
      }

      dependencies.forEach((dep) => visit(dep, [...path, current]));

      state[current] = "visited";

      sorted.push(current);
    }
  }
}
