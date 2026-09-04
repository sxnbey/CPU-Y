import type { IErrorMessage, IErrorArgument } from "#kernel/contract/index";

import { FrameworkError } from "./framework-error.js";

const registryError = {
  ERR_REGISTRY_ALREADY_REGISTERED: {
    headline: "Registry already registered",
    details:
      "The registry with name {NAME} has already been registered.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the registry is not registered already with .has().",
  },
  ERR_REGISTRY_NOT_FOUND: {
    headline: "Registry not found",
    details: "The registry with name {NAME} does not exist.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the registry is registered before attempting to access it.",
  },
  ERR_ENTRY_ALREADY_REGISTERED: {
    headline: "Registry entry already registered",
    details:
      "The entry with id {NAME} has already been registered.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the entry is not registered already with .has().",
  },
  ERR_ENTRY_NOT_FOUND: {
    headline: "Registry entry not found",
    details: "The entry with id {NAME} does not exist.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the entry is registered before attempting to access it.",
  },
} satisfies Record<string, IErrorMessage>;

export class RegistryError extends FrameworkError<typeof registryError> {
  constructor({
    errorCode,
    args,
  }: {
    errorCode: keyof typeof registryError;
    args?: IErrorArgument;
  }) {
    super({
      errorTemplates: registryError,
      errorCode,
      ...(args && { args }),
    });
  }
}
