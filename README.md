# CPU-Y ![Status](https://img.shields.io/badge/Status-Work_in_progress-yellow)

![Tech-Stack](https://skillicons.dev/icons?i=ts,nodejs)

CPU-Y is a TypeScript framework for terminal apps with dependency injection, lifecycle hooks and hot reload with state preservation.

> **Work in progress:** The foundation is in place, hot reload and the terminal module are in progress.

## Status

**Working**

- **Dependency injection** via decorators (`@Instance`, `@Inject`, `@Config`). Dependencies are sorted and cycles are detected.
- **Rollback on install**: If a service throws while being built, all services built so far are removed again.
- **Lifecycle** with `onStart` & `onStop` hooks: Services start in dependency order and stop in reverse. If an `onStart` throws, the services that were already started are stopped again.
- **Modules**: Extensions with their own registries and services.
- **Scopes**: `persistent` services survive a reload, all others are rebuilt.
- **Strictly typed, detailed error messages** with file, export, cause chain and a suggested fix.
- **Loader**: loads all exports from a folder, so they don't have to be registered one by one.

**In progress**

- Hot reload with state preservation (`onSnapshot` & `onRestore`)
- Terminal module (input, commands, renderer)

## Example

```typescript
import type { Logger } from "#kernel/log/logger";
import type { OnStart, OnStop } from "#contract";

import { Instance, Inject, Config } from "#kernel/metadata/decorator/index";

@Instance({ id: "greeter", scope: "persistent" })
export class Greeter implements OnStop {
  constructor(@Inject("logger") private readonly logger: Logger) {}

  public greet(name: string): void {
    this.logger.info(`Moin, ${name}!`);
  }

  public onStop(): void {
    this.logger.info("Tschüss!");
  }
}

@Instance({ id: "welcome" })
export class Welcome implements OnStart {
  constructor(
    @Inject("greeter") private readonly greeter: Greeter,
    @Config() private readonly config: { name: string },
  ) {}

  public onStart(): void {
    this.greeter.greet(this.config.name);
  }
}
```

```typescript
import { join } from "node:path";
import { bootstrap } from "./bootstrap.js";

const system = bootstrap({
  path: join(import.meta.dirname, "example/"),
  configs: { welcome: { name: "senbey" } },
});

await system.boot();

await system.stop();
```

Output:

```
[info \ CPU-Y / 2026-11-01T19:59:54.260Z] - Moin, senbey!
[info \ CPU-Y / 2026-11-01T19:59:54.263Z] - Tschüss!
```

## Concepts

### Services

A service is a class or function that the framework builds and manages. Every service has a **unique** `id`.

```typescript
@Instance({ id: "greeter" })
export class Greeter { … }

export const formatGreeting = decorateFunction({ id: "formatGreeting" }, (text: string) => { … });
```

Functions are marked with `decorateFunction`, because TypeScript decorators can't be applied to plain functions.

Dependencies are declared in the constructor:

- `@Inject("id")`: another service
- `@Config()`: the configuration from `bootstrap({ configs: { … } })`, at most once per service

A parameter without a decorator causes an error, unless it comes at the end and has a default value.
Exports without `@Instance` or `decorateFunction()` are ignored, so helper functions, constants etc. can live in the same files.

### Scopes

A service's scope determines how long it lives.

- `reloadable` (default): rebuilt on every reload.
- `persistent`: stays alive across reloads.

```typescript
@Instance({ id: "evoMortar", scope: "persistent" })
```

That's why persistent services live in a higher layer, so the reloadable layer can simply be swapped out.

A persistent service **cannot** depend on a reloadable service. Otherwise it would hold on to an outdated instance for its entire lifetime, even after that dependency has been reloaded several times. The other way around works just fine.

### Lifecycle

Services can optionally implement `onStart()` and `onStop()` hooks, either synchronous or `async`.

```typescript
@Instance({ id: "database" })
export class Database implements OnStart, OnStop {
  async onStart() {
    /* open connection */
  }

  async onStop() {
    /* close connection */
  }
}
```

- **Start**: in dependency order. A service can only start once all of its dependencies have started. Persistent services start before reloadable ones.

- **Stop**: in reverse order, meaning reloadable services first, then the persistent ones.

**Error handling:**

- `onStart()`: all services started so far are stopped, and `boot()` throws a `LifecycleError` with the original error as its `cause`.

- `onStop()`: the error is logged, and the remaining services are still stopped.

### Modules

A module extends the framework with additional registries and services. Module services are completely normal services with decorators, scopes and lifecycle hooks.

```typescript
import type { Module } from "#contract";

export const terminalModule: Module = {
  name: "terminal",
  registries: [{ registry: CommandRegistry, build: buildCommand }],
  services: { InputHandler, CommandHandler },
};
```

```typescript
const system = bootstrap({
  path: join(import.meta.dirname, "app/"),
  modules: [terminalModule],
});
```

Module services can be injected like any other service, and exports targeting a module's registry end up in that registry.

**`modules` vs. `overrides`**

- `modules` adds: new registries and services that extend the framework.
- `overrides` replaces parts of the core, for example with a custom logger:

```typescript
bootstrap({ path, overrides: { logger: CustomLogger } });
```

## Architecture
