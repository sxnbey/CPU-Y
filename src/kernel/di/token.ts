import type { Token } from "#contract";

export function token<T>(id: string): Token<T> {
  return id as Token<T>;
}
