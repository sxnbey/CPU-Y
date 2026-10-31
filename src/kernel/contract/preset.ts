import type { EntryBuilder, Loader, Registry, Constructor } from "#contract";

import { Logger } from "#kernel/log/logger";
import { LogStream } from "#kernel/log/stream";

export interface CorePreset {
  logStream: Constructor<LogStream>;
  logger: Constructor<Logger>;
  loader: Loader;
  registries: { registry: Constructor<Registry>; build: EntryBuilder }[];
}

export type CoreOverrides = Partial<CorePreset>;
