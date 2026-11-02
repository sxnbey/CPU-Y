___________________ ____ ___         _____.___.
\_   ___ \______   \    |   \        \__  |   |
/    \  \/|     ___/    |   /  ______ /   |   |
\     \___|    |   |    |  /  /_____/ \____   |
 \______  /____|   |______/           / ______|
        \/                            \/       

# CPU-Y ![Status](https://img.shields.io/badge/Status-Work_in_progress-yellow)

![Tech-Stack](https://skillicons.dev/icons?i=ts,nodejs)

CPU-Y is a TypeScript framework for terminal apps with dependency injection, lifecycle hooks and hot reload with state preservation.

> **Work in progress:** The foundation is in place, hot reload and the terminal module are in progress.

## Contents

- [Status](#status)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Example](#example)
- [Concepts](#concepts): [Services](#services) - [Scopes](#scopes) - [Lifecycle](#lifecycle) - [Modules](#modules)
- [Architecture](#architecture): [Boot sequence](#boot-sequence) - [Layers](#layers) - [Folder structure](#folder-structure) - [Design decisions](#design-decisions)
- [Roadmap](#roadmap)
- [License](#license)

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

## Requirements

- **Node.js 22** or newer
- **TypeScript** with `experimentalDecorators` enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

This framework uses the legacy decorator implementation on purpose because parameter decorators like `@Inject()` and `@Config()` are only supported there.

## Getting started

```bash
git clone https://github.com/sxnbey/CPU-Y.git
cd CPU-Y
npm install
npm run build
npm start
```

`npm start` runs the example from `src/example/`. During development, `npm run dev` rebuilds on every change and starts the example again.

> **Note:** The examples below import from internal paths (`#kernel/...`, `#contract`). A public entry point will follow.

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

If something is wrong, the error tells you where and how to fix it. For example, when a module is missing:

```
InstallError: Unknown target registry
Details: Target registry "commandRegistry" for export "quit" in "app/quit.js" is not registered.
Potential fix: Please ensure the module that provides the target registry is added.
```

## Concepts

### Services

A service is a class or function that the framework builds and manages. Every service has a **unique** `id`.

```typescript
@Instance({ id: "greeter" })
export class Greeter { … }

export const formatGreeting = decorateFunction({ id: "formatGreeting" }, (text: string) => { … });
```

Functions are decorated with `decorateFunction()`, because TypeScript decorators can't be applied to plain functions.

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

### Boot sequence

**`bootstrap()`** wires everything together once:

1. Collects the registries from the core preset and all modules.
2. Creates the core layer and registers the `logStream` and `logger` in it.
3. Creates the installer and adds an entry builder for every registry.
4. Collects the services of all modules and hands everything over to the `System`.

**`system.boot()`** builds and starts the app:

1. The loader imports all exports from the app folder and adds the module services.
2. All services are split by scope into `persistent` and `reloadable`.
3. The persistent services are installed into a new layer below the core and started.
4. The reloadable services are installed into a third layer below the persistent one and started.
5. If step 4 fails, the persistent services are stopped again and `system.boot()` throws. Nothing is kept, so `system.boot()` can be called again.

### Layers

Services live in three layers. Each layer can only look up services in itself and in the layers above it.

| Layer        | Contains            | Lifetime                                     |
| ------------ | ------------------- | -------------------------------------------- |
| `core`       | logger, logStream   | created once by `bootstrap()`                |
| `persistent` | persistent services | created in `system.boot()`, survives reloads |
| `app`        | reloadable services | swapped out on every reload                  |

Since lookups only go upwards, nothing depends on the app layer. During a hot reload, the app layer is simply swapped for a fresh one.

This is also why a persistent service can't depend on a reloadable one (see [Scopes](#scopes)).

### Folder structure

| Folder      | Responsibility                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `contract/` | All shared types, interfaces and enums. Contains no logic.                                                              |
| `di/`       | Dependency injection: sorts services by their dependencies, resolves them and creates the instances.                    |
| `error/`    | The base `FrameworkError` and all error groups with their typed message templates.                                      |
| `install/`  | Brings everything together: validates exports, orders them and installs the entries into the registries, with rollback. |
| `load/`     | The loader that scans a folder and imports all exports.                                                                 |
| `log/`      | The logger and its stream, where custom output can be plugged in.                                                       |
| `metadata/` | Everything that handles metadata: the decorators and the metadata accessor.                                             |
| `registry/` | The base registry, the concrete registries, the main registry and the resolver that answers lookups across layers.      |
| `util/`     | Small helpers: formatters and type guards.                                                                              |

### Design decisions

- **Rollback by throwing away a layer.** If a boot fails, the new layer is simply discarded instead of deleting entries one by one, because nothing depends on the layer. Hot reload uses the exact same mechanism.
- **Validate first, then build.** Everything that can be checked upfront is checked before a single service is built. Errors that can't be predicted are handled by a rollback.
- **Everything is a service.** Module services are passed on as normal exports and go through the same installer as app services. Validation, ordering, rollback, lifecycle and scopes work for them without a second code path.
- **Typed error templates.** Placeholders like `{ID}` in a message template are inferred as required arguments, so an error with missing details doesn't compile. Every error has a fixed code that tests can check against.

## Roadmap

1. **Hot reload with state preservation**

   Swap the app layer on file changes and carry state over with `onSnapshot` / `onRestore`.

2. **Terminal module**
   - **Input handler:** translates every keypress into key events.
   - **Command handler:** subscribes to the input handler and runs the matching commands.
   - **Renderer:** a tree of elements, similar to the DOM, drawn into a screen buffer. Each element draws only into its own area, and elements can be found and manipulated with `getElement()`.

## License

MIT, see [LICENSE](LICENSE).
