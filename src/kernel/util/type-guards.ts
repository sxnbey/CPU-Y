import type { BaseMetadata, OnStart, OnStop } from "#contract";

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

export function hasOnStart(target: unknown): target is OnStart {
  return (
    typeof target === "object" &&
    target !== null &&
    "onStart" in target &&
    typeof target.onStart === "function"
  );
}

export function hasOnStop(target: unknown): target is OnStop {
  return (
    typeof target === "object" &&
    target !== null &&
    "onStop" in target &&
    typeof target.onStop === "function"
  );
}
