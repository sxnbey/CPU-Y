import type { BaseMetadata, RegistryEntry, Config } from "#contract";

type DependencyResolver = (
  source: new (...args: any[]) => unknown,
  config?: Config,
) => unknown[];

export function create<T>(
  Class: new (...args: any[]) => T,
  metadata: BaseMetadata,
  resolveDependencies: DependencyResolver,
  config?: Config,
): RegistryEntry<T> {
  const constructorArgs = resolveDependencies(Class, config);
  const value = new Class(...constructorArgs);

  return { metadata, value };
}
