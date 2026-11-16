import type { Constructor, Func, OnStart, OnStop } from "#contract";

export function isClass(target: unknown): target is Constructor {
  if (typeof target !== "function") return false;

  return (
    Object.getOwnPropertyDescriptor(target, "prototype")?.writable === false
  );
}

export function isPlainFunction(target: unknown): target is Func {
  return typeof target === "function" && !isClass(target);
}

export function isError(target: unknown): target is Error {
  return target instanceof Error;
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
