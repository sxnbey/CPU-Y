import type { ErrorTemplates } from "#contract";

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
    details: 'Class "{NAME}" requires a configuration, but none was provided.',
    fix: "Please ensure the configuration has been passed to the bootstrap.",
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
} as const satisfies ErrorTemplates;

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
} as const satisfies ErrorTemplates;

//

export class LoadError extends FrameworkError<typeof loadErrors> {
  constructor(params: ErrorParameter<typeof loadErrors>) {
    super({ errorTemplates: loadErrors, ...params });
  }
}

const loadErrors = {
  ERR_PATH_NOT_ABSOLUTE: {
    headline: "Loading path is not absolute",
    details: 'Loading path "{PATH}" must be absolute.',
    fix: 'Use join(import.meta.dirname, "yourDir") or new URL("yourDir", import.meta.url).',
  },
  ERR_PATH_NOT_FOUND: {
    headline: "Loading path does not exist",
    details: 'Loading path "{PATH}" does not exist.',
    fix: 'Please ensure path "{PATH}" is a valid path.',
  },
  ERR_PATH_NOT_A_DIRECTORY: {
    headline: "Loading path is not a directory",
    details: 'Loading path "{PATH}" is not a directory.',
    fix: 'Please ensure the path "{PATH}" leads to a directory.',
  },
  ERR_DIRECTORY_READ_FAILED: {
    headline: "Directory read failed",
    details: 'An error occurred while reading path "{PATH}".',
  },
  ERR_IMPORT_FAILED: {
    headline: "File import failed",
    details: 'An error occurred while importing file "{FILE}".',
  },
} as const satisfies ErrorTemplates;

//

export class InstallError extends FrameworkError<typeof installErrors> {
  constructor(params: ErrorParameter<typeof installErrors>) {
    super({ errorTemplates: installErrors, ...params });
  }
}

const installErrors = {
  ERR_BUILDER_ALREADY_REGISTERED: {
    headline: "Builder already registered",
    details: 'Builder for registry "{NAME}" is already registered.',
    fix: "Please ensure only one builder per registry is being registered.",
  },
  ERR_MISSING_BUILDER: {
    headline: "Missing builder",
    details:
      'No builder exists for registry "{REGISTRYNAME}". Used by "{NAME}" in "{FILE}".',
    fix: "Please ensure a builder for this registry has been registered.",
  },
  ERR_DUPLICATE_ID: {
    headline: "Duplicate id",
    details:
      'Export with id "{ID}" as "{NAME}" in "{FILE}" and as "{EXISTINGNAME}" in "{EXISTINGFILE}" has the same id.',
    fix: "Please make sure the ids are unique.",
  },
  ERR_ID_ALREADY_REGISTERED: {
    headline: "Id is already registered",
    details:
      'Export with id "{ID}" as "{NAME}" in "{FILE}" is already registered.',
    fix: "Please make sure the ids are unique.",
  },
  ERR_MISSING_CONFIG: {
    headline: "Missing configuration",
    details:
      'Export with id "{ID}" as "{NAME}" in "{FILE}" requires a configuration, but none was provided.',
    fix: "Please ensure the configuration has been passed to the bootstrap.",
  },
  ERR_UNEXPECTED_CONFIG: {
    headline: "Unexpected configuration",
    details:
      'Export with id "{ID}" as "{NAME}" in "{FILE}" has no @Config decorator, but one was provided.',
    fix: 'Please ensure the provided configuration object is needed by export "{NAME}".',
  },
  ERR_UNRESOLVABLE_CONFIG: {
    headline: "Configuration is unresolvable",
    details:
      'A configuration for id "{ID}" was provided, but no matching export is being installed.',
    fix: "Please ensure the right id was provided to the bootstrap.",
  },
  ERR_UNKNOWN_ID: {
    headline: "Internal error: Unknown id",
    details: 'Sorter returned unknown id "{ID}".',
  },
  ERR_SOURCE_IS_NOT_CLASS: {
    headline: "Provided source is not a class",
    details: 'The provided source "{SOURCE}" is not a class.',
    fix: "Please ensure the provided source is a class.",
  },
  ERR_SOURCE_IS_NOT_FUNCTION: {
    headline: "Provided source is not a function",
    details: 'The provided source "{SOURCE}" is not a function.',
    fix: "Please ensure the provided source is a function.",
  },
  ERR_BUILD_FAILED: {
    headline: "Failed to build service",
    details:
      'Building "{ID}" as "{NAME}" in "{FILE}" failed. The install was rolled back.\nRolled back: {ROLLEDBACK}',
  },
} as const satisfies ErrorTemplates;

//

const decoratorErrors = {
  ERR_INVALID_DECORATOR_TARGET: {
    headline: "Invalid decorator target",
    details:
      "Decorator @{DECORATOR} can only be used on constructor parameters, not method parameters.",
    fix: "Please ensure the @{DECORATOR} decorator is used on a constructor parameter.",
  },
  ERR_DECORATOR_CAN_ONLY_BE_USED_ONCE: {
    headline: "Decorator can only be used once",
    details: "Decorator @{DECORATOR} can only be used once per constructor.",
    fix: "Please ensure the @{DECORATOR} decorator is only used once per constructor.",
  },
  ERR_PARAMETER_INDEX_ALREADY_USED: {
    headline: "Parameter already decorated",
    details:
      '@{DECORATOR} cannot be applied to parameter "{INDEX}" in class "{TARGET}" because it is already decorated.',
    fix: "Please ensure only one decorator is being used per parameter.",
  },
} as const satisfies ErrorTemplates;

export class DecoratorError extends FrameworkError<typeof decoratorErrors> {
  constructor(params: ErrorParameter<typeof decoratorErrors>) {
    super({ errorTemplates: decoratorErrors, ...params });
  }
}

//

const lifecycleErrors = {
  ERR_START_FAILED: {
    headline: "Start failed",
    details:
      'Service with id "{ID}" failed to start. See the cause below. Already started services were stopped.\nStopped: {STOPPED}',
  },
  ERR_STOP_FAILED: {
    headline: "Stop failed",
    details: 'Service with id "{ID}" failed to stop. See the cause below.',
  },
  ERR_ALREADY_BOOTED: {
    headline: "System already booted",
    details: "The system has already booted.",
    fix: "Please ensure stop() has been called before booting again.",
  },
} as const satisfies ErrorTemplates;

export class LifecycleError extends FrameworkError<typeof lifecycleErrors> {
  constructor(params: ErrorParameter<typeof lifecycleErrors>) {
    super({ errorTemplates: lifecycleErrors, ...params });
  }
}
