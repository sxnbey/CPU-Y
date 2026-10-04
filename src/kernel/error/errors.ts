import type { ErrorMessage } from "#contract";

import { FrameworkError, type ErrorParameter } from "./framework-error.js";

export class FactoryError extends FrameworkError<typeof factoryErrors> {
  constructor(params: ErrorParameter<typeof factoryErrors>) {
    super({ errorTemplates: factoryErrors, ...params });
  }
}

const factoryErrors = {
  ERR_MISSING_METADATA: {
    headline: "Missing metadata",
    details: 'The metadata is missing for blueprint with name "{NAME}".',
    fix: 'Please ensure blueprint "{NAME}" is properly decorated with @Decorators.',
  },
  ERR_INVALID_SOURCE: {
    headline: "Invalid source",
    details: `The source provided to InstanceFactory is invalid. InstanceFactory expected a class or a raw blueprint configuration object matching the base metadata.\nSource: {SOURCE}`,
    fix: 'Please ensure the provided source "{SOURCE}" is a Class or satisfies the BaseMetadata interface.',
  },
  ERR_UNEXPECTED_CONFIG: {
    headline: "Unexpected configuration",
    details: `The configuration object for blueprint "{NAME}" provided to InstanceFactory was unexpected.`,
    fix: "Please ensure the passed to configuration object is needed by blueprint {NAME}.",
  },
  ERR_MISSING_CONFIG: {
    headline: "Missing configuration",
    details:
      'InstanceFactory expected a configuration object for parameter at index "{INDEX}" for blueprint {NAME}.',
    fix: 'Please ensure a configuration object at index "{INDEX}" for blueprint "{NAME}" has been passed to the InstanceFactory.',
  },
  ERR_MISSING_DEPENDENCY_DECORATOR: {
    headline: "Missing dependency decorator",
    details:
      'The blueprint "{NAME}" expected a dependency at index "{INDEX}", but none was decorated.',
    fix: 'Please ensure the dependency at index "{INDEX}" for blueprint "{NAME}" has been decorated with @Inject.',
  },
  ERR_DEPENDENCY_NOT_FOUND: {
    headline: "Missing dependencies",
    details:
      'InstanceFactory could not resolve dependency "{ID}" at index "{INDEX}" for blueprint "{NAME}".',
    fix: 'Please ensure that the dependency "{ID}" is registered in the registry.',
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
    details:
      'The registry with name "{NAME}" has already been registered.' +
      originString,
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
