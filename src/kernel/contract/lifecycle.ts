export interface OnSnapshot {
  onSnapshot(): unknown;
}

export interface OnRestore {
  onRestore(state: unknown): void;
}

export interface OnStart {
  onStart(): void | Promise<void>;
}

export interface OnStop {
  onStop(): void | Promise<void>;
}
