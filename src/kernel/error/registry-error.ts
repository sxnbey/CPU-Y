import type { IErrorMessage } from "#contract";

import { FrameworkError, type ErrorTemplateArgs } from "./framework-error.js";

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
} as const satisfies Record<string, IErrorMessage>;

// ^^^ "as const" ensures the string literal types get preserved and not widened as string,
// because the types of the placeholders need to get extracted.

export class RegistryError<
  K extends keyof typeof registryErrors,
> extends FrameworkError<typeof registryErrors, K> {
  constructor({
    errorCode,
    args,
  }: {
    errorCode: K;
    args: ErrorTemplateArgs<typeof registryErrors, K>;
  }) {
    super({
      errorTemplates: registryErrors,
      errorCode: errorCode,
      ...(args && { args }),
    });
  }
}
