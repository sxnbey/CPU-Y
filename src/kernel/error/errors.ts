import type { ErrorMessage } from "#contract";

import { FrameworkError, type ErrorParameter } from "./framework-error.js";

export class DependencyInjectionError extends FrameworkError<
  typeof dependencyInjectionErrors
> {
  constructor(params: ErrorParameter<typeof dependencyInjectionErrors>) {
    super({ errorTemplates: dependencyInjectionErrors, ...params });
  }
}

const dependencyInjectionErrors = {
  ERR_MISSING_METADATA: {
    headline: "Missing metadata",
    details: 'The metadata is missing for class with name "{NAME}".',
    fix: 'Please ensure class "{NAME}" is properly decorated with @Decorators.',
  },
  ERR_INVALID_SOURCE: {
    headline: "Invalid source",
    details: `The source provided is not a class.\nSource: "{SOURCE}"`,
    fix: 'Please ensure the provided source "{SOURCE}" is a Class.',
  },
  ERR_UNEXPECTED_CONFIG: {
    headline: "Unexpected configuration",
    details:
      'Class "{NAME}" has no @Config decorator, but a configuration was provided.',
    fix: 'Please ensure the provided configuration object is needed by class "{NAME}".',
  },
  ERR_MISSING_CONFIG: {
    headline: "Missing configuration",
    details: 'Class "{NAME}" requires a config, but none was provided.',
    fix: "Please ensure it has been passed to the bootstrap.",
  },
  ERR_MISSING_DEPENDENCY_DECORATOR: {
    headline: "Missing dependency decorator",
    details:
      'The class "{NAME}" expected a dependency at index "{INDEX}", but none was decorated.',
    fix: 'Please ensure the dependency at index "{INDEX}" for class "{NAME}" has been decorated with @Inject.',
  },
  ERR_DEPENDENCY_NOT_FOUND: {
    headline: "Dependency not found",
    details: 'Dependency "{ID}" for class "{NAME}" could not be resolved.',
    fix: 'Please ensure that the dependency "{ID}" is registered in the registry.',
  },
  ERR_CIRCULAR_DEPENDENCY_DETECTED: {
    headline: "Circular dependency detected",
    details: '"{SERVICE}" depends on itself through:\n{PATH}',
    fix: "Please move the shared logic into a third service that both depend on.",
  },
  ERR_UNKNOWN_DEPENDENCY: {
    headline: "Unknown dependency",
    details:
      'Dependency "{DEPENDENCY}" for {SERVICE} was not found.\nPath: {PATH}',
    fix: "Please ensure the dependency id is correct or the dependency is in the load path.",
  },
} as const satisfies Record<string, ErrorMessage>;

//

export class RegistryError extends FrameworkError<typeof registryErrors> {
  constructor(params: ErrorParameter<typeof registryErrors>) {
    super({ errorTemplates: registryErrors, ...params });
  }
}

const originString = "Origin: {ORIGIN}";
const registryErrors = {
  ERR_REGISTRY_ALREADY_REGISTERED: {
    headline: "Registry already registered",
    details: `The registry with name "{NAME}" has already been registered.\n${originString}`,
    fix: "Please ensure that the registry is not registered already with .has().",
  },
  ERR_REGISTRY_NOT_FOUND: {
    headline: "Registry not found",
    details: `The registry with name "{NAME}" does not exist.\n${originString}`,
    fix: "Please ensure that the registry is registered before attempting to access it.",
  },
  ERR_ENTRY_ALREADY_REGISTERED: {
    headline: "Registry entry already registered",
    details: `The entry with id "{NAME}" has already been registered.\n${originString}`,
    fix: "Please ensure that the entry is not registered already with .has().",
  },
  ERR_ENTRY_NOT_FOUND: {
    headline: "Registry entry not found",
    details: `The entry with id "{NAME}" does not exist.\n${originString}`,
    fix: "Please ensure that the entry is registered before attempting to access it.",
  },
} as const satisfies Record<string, ErrorMessage>;
