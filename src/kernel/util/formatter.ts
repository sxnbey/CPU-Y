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
