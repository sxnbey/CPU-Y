export interface SystemControl {
  stop(): Promise<void>;
}

export interface Application extends SystemControl {
  boot(): Promise<void>;
}
