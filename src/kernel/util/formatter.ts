export function formatToString(target: unknown): string {
  if (typeof target === "string") return target;

  if (target === undefined) return "undefined";

  if (target === null) return "null";

  try {
    if (typeof target === "object") return JSON.stringify(target);
  } catch {}

  return String(target);
}

export function formatToError(target: unknown): Error {
  return target instanceof Error ? target : new Error(formatToString(target));
}

export function formatDecoratorTarget(target: object): string {
  return typeof target === "function" ? target.name : formatToString(target);
}

export function describeError(error: Error): string {
  return error.stack || `${error.name}: ${error.message}`;
}
