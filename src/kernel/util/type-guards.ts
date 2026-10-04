import type { BaseMetadata } from "#kernel/contract/metadata";

export function isClass(
  target: unknown,
): target is new (...args: any[]) => unknown {
  if (typeof target !== "function") return false;

  const string = Function.prototype.toString.call(target);

  return string.startsWith("class ") || string.startsWith("class{");
}

export function isMetadata(target: unknown): target is BaseMetadata {
  if (typeof target !== "object" || target === null) return false;

  return (
    "id" in target &&
    typeof (target as BaseMetadata).id === "string" &&
    "targetRegistry" in target &&
    typeof (target as BaseMetadata).targetRegistry === "string"
  );
}
