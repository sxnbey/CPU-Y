import type { IErrorMessage } from "#kernel/contract/index";

import {
  FrameworkError,
  type ErrorTemplateArguments,
} from "#kernel/error/framework-error";

const sourceString = "Source: {SOURCE}";
const factoryErrors = {
  ERR_MISSING_METADATA: {
    headline: "Missing metadata",
    details: 'The metadata is missing for blueprint with name "{NAME}".',
    fix: 'Please ensure blueprint "{NAME}" is properly decorated with @Decorators.',
  },
  ERR_INVALID_SOURCE: {
    headline: "Invalid source",
    details: `The source provided to InstanceFactory is invalid. InstanceFactory expected a class extending BaseBlueprint or a raw blueprint configuration object matching the base metadata.\n${sourceString}`,
    fix: 'Please ensure the provided source "{SOURCE}" is a child of BaseBlueprint or satisfies the IBaseMetadata interface.',
  },
  ERR_UNEXPECTED_CONFIG: {
    headline: "Unexpected configuration",
    details: `The configuration object provided to InstanceFactory was unexpected.\n${sourceString}`,
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
} as const satisfies Record<string, IErrorMessage>;

export class RegistryError<
  K extends keyof typeof factoryErrors,
> extends FrameworkError<typeof factoryErrors, K> {
  constructor({
    errorCode,
    args,
  }: {
    errorCode: K;
    args: ErrorTemplateArguments<typeof factoryErrors, K>;
  }) {
    super({
      errorTemplates: factoryErrors,
      errorCode: errorCode,
      ...(args && { args }),
    });
  }
}
