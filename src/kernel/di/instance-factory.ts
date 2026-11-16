import type {
  BaseMetadata,
  RegistryEntry,
  Config,
  Constructor,
} from "#contract";

type DependencyResolver = (source: Constructor, config?: Config) => unknown[];

export function create<T>(
  Class: Constructor<T>,
  metadata: BaseMetadata,
  resolveDependencies: DependencyResolver,
  config?: Config,
): RegistryEntry<T> {
  const constructorArgs = resolveDependencies(Class, config);
  const value = new Class(...constructorArgs);

  return { metadata, value };
}
