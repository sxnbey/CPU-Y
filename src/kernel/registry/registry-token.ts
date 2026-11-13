import type { KnownRegistries, Token } from "#contract";

import { token } from "#kernel/di/token";

export function registryToken<N extends keyof KnownRegistries>(
  name: N,
): Token<KnownRegistries[N]> {
  return token(`reg:${name}`);
}
