export type Constructor<T = unknown> = new (...args: any[]) => T;

export type Func<ReturnValue = unknown> = (...args: any[]) => ReturnValue;
