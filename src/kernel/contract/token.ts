// This declared symbol brands the string with the target's type so TypeScript can infer it.
// It vanishes completely at runtime and can't be accessed anywhere in the code.

declare const tokenType: unique symbol;

export type Token<T> = string & { readonly [tokenType]: T };

export type TokenValue<T> = T extends Token<infer V> ? V : never;

export type TokenValues<TokenArray> = {
  [K in keyof TokenArray]: TokenValue<TokenArray[K]>;
};
