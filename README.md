<div align="center"><pre>
___________________ ____ ___         _____.___.
\_   ___ \______   \    |   \        \__  |   |
/    \  \/|     ___/    |   /  ______ /   |   |
\     \___|    |   |    |  /  /_____/ \____   |
 \______  /____|   |______/           / ______|
        \/                            \/
</pre></div>

# CPU-Y ![Status](https://img.shields.io/badge/Status-Work_in_progress-yellow)

![Tech-Stack](https://skillicons.dev/icons?i=ts,nodejs)

CPU-Y is a TypeScript framework for terminal apps with dependency injection, lifecycle hooks and hot reload with state preservation.

> **Work in progress:** The foundation and the public API are in place, hot reload and the terminal module are in progress.

## Contents

- [Status](#status)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Example](#example)
- [Concepts](#concepts): [Services](#services) - [Tokens](#tokens) - [Scopes](#scopes) - [Lifecycle](#lifecycle) - [Modules](#modules)
- [Architecture](#architecture): [Boot sequence](#boot-sequence) - [Layers](#layers) - [Folder structure](#folder-structure) - [Design decisions](#design-decisions)
- [Roadmap](#roadmap)
- [License](#license)

## Status

**Working**

- **Dependency injection** via decorators (`@Instance`, `@Inject`, `@Config`). Dependencies are sorted and cycles are detected.
- **Typed tokens**: ids are declared once with `token<T>()` instead of repeating strings everywhere.
- **Rollback on install**: If a service throws while being built, all services built so far are removed again.
- **Lifecycle** with `onStart` & `onStop` hooks: Services start in dependency order and stop in reverse. If an `onStart` throws, the services that were already started are stopped again.
- **Modules**: Extensions with their own registries and services. Registries are strictly typed and can be injected with `registryToken()`.
- **Scopes**: `persistent` services survive a reload, all others are rebuilt.
- **Strictly typed, detailed error messages** with file, export, cause chain and a suggested fix.
- **Loader**: loads all exports from a folder, so they don't have to be registered one by one.
- **Public API**: everything is imported from `cpuy`, internal files can't be reached from outside.

**In progress**

- Hot reload with state preservation (`onSnapshot` & `onRestore`)
- Terminal module (input, commands, renderer)

## Requirements

- **Node.js 22** or newer
- **ES modules**: CPU-Y is an ES module, so your project needs `"type": "module"` in its `package.json`.
- **TypeScript** with these options:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "experimentalDecorators": true
  }
}
```

This framework uses the legacy decorator implementation on purpose because parameter decorators like `@Inject()` and `@Config()` are only supported there. `NodeNext` is needed so TypeScript finds the types of CPU-Y through its `exports` field.

## Getting started

**Running the example**

```bash
git clone https://github.com/sxnbey/CPU-Y.git
cd CPU-Y
npm install
npm run build
npm start
```

`npm start` runs the example from `src/example/`. During development, `npm run dev` rebuilds on every change and starts the example again. It keeps watching for changes until you stop it with `Ctrl+C`.

**Using CPU-Y in your own project**

CPU-Y isn't on npm yet. Until then, it can be added as a local dependency:

```json
"dependencies": {
  "cpuy": "file:../CPU-Y"
}
```

After `npm install`, everything is imported from `cpuy`. CPU-Y has to be built first and rebuilt after every change, or you keep `npm run dev` running in the CPU-Y folder.

> **Note:** The folder passed to `bootstrap()` is loaded completely. Keep your entry file outside of it, otherwise the loader imports it a second time and `boot()` never finishes.

## Example

```
src/
├── main.ts
└── app/
    └── greeter.ts
```

```typescript
// app/greeter.ts
import type { Logger, OnStart, OnStop } from "cpuy";

import { Instance, Inject, Config, LOGGER } from "cpuy";

@Instance({ id: "greeter", scope: "persistent" })
export class Greeter implements OnStop {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

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
// main.ts
import { join } from "node:path";
import { bootstrap } from "cpuy";

const system = bootstrap({
  path: join(import.meta.dirname, "app"),
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

- `@Inject("id")` or `@Inject(TOKEN)`: another service (see [Tokens](#tokens))
- `@Config()`: the configuration from `bootstrap({ configs: { … } })`, at most once per service

A parameter without a decorator causes an error, unless it comes at the end and has a default value.
Exports without `@Instance` or `decorateFunction()` are ignored, so helper functions, constants etc. can live in the same files.

### Tokens

A token is an id with a type attached. It is declared once and used everywhere instead of repeating the string.

```typescript
import { token } from "cpuy";

export const GREETER = token<Greeter>("greeter");

@Instance({ id: GREETER })
export class Greeter { … }
```

```typescript
constructor(@Inject(GREETER) private readonly greeter: Greeter) {}
```

A typo in a token is a compile error, a typo in a string is only noticed at boot.

> **Note:** A token doesn't type the constructor parameter. Parameter decorators can't change the type of a parameter, so the type still has to be written next to it.

CPU-Y comes with these tokens:

| Token            | Type            | What it is                                                                         |
| ---------------- | --------------- | ---------------------------------------------------------------------------------- |
| `LOGGER`         | `Logger`        | The logger.                                                                        |
| `LOG_STREAM`     | `LogStream`     | The stream every log goes through. Custom output is plugged in with `setWriter()`. |
| `SYSTEM_CONTROL` | `SystemControl` | Lets a service stop the app, for example a `quit` command.                         |

### Scopes

A service's scope determines how long it lives.

- `reloadable` (default): rebuilt on every reload.
- `persistent`: stays alive across reloads.

```typescript
@Instance({ id: "evoMortar", scope: "persistent" })

decorateFunction({ id: "formatGreeting", scope: "persistent" }, …)
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

> **Note:** After `system.stop()` the process ends by itself. If it doesn't, a service forgot to clean up something in `onStop()`, like an open connection or a listener on the keyboard.

### Modules

A module extends the framework with additional registries and services. Module services are completely normal services with decorators, scopes and lifecycle hooks.

```typescript
import type { Module } from "cpuy";

export const terminalModule: Module = {
  name: "terminal",
  registries: [{ registry: CommandRegistry, build: buildCommand }],
  services: { Terminal, Prompt, CommandRunner },
};
```

```typescript
const system = bootstrap({
  path: join(import.meta.dirname, "app"),
  modules: [terminalModule],
});
```

Module services can be injected like any other service, and exports targeting a module's registry end up in that registry.

**Adding a registry**

Registry names are strictly typed. A module has to add its registry to `RegistryPayloadMap`, otherwise the registry doesn't compile:

```typescript
import type { RegistryEntry } from "cpuy";

declare module "cpuy" {
  interface RegistryPayloadMap {
    commandRegistry: RegistryEntry<Command>;
  }
}
```

**Injecting a registry**

Every layer registers its own registries, so they can be injected with `registryToken()`:

```typescript
constructor(
  @Inject(registryToken("commandRegistry"))
  private readonly commands: KnownRegistries["commandRegistry"],
) {}
```

- A registry only contains the entries of its own layer. A reloadable service gets the registry of the app layer, a persistent service the one of the persistent layer.
- Read it in `onStart()` or later, not in the constructor. While the constructor runs, the layer isn't completely installed yet.

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
4. Collects the services of all modules and hands everything over to the `System`, which registers the `systemControl` in the core layer.

Every layer, the core included, gets its own instance of every registry and registers them in itself under `reg:<name>`, so they can be injected.

**`system.boot()`** builds and starts the app:

1. The loader imports all exports from the app folder and adds the module services.
2. All services are split by scope into `persistent` and `reloadable`.
3. The persistent services are installed into a new layer below the core and started.
4. The reloadable services are installed into a third layer below the persistent one and started.
5. If step 4 fails, the persistent services are stopped again and `system.boot()` throws. Nothing is kept, so `system.boot()` can be called again.

### Layers

Services live in three layers. Each layer can only look up services in itself and in the layers above it.

| Layer        | Contains                         | Lifetime                                     |
| ------------ | -------------------------------- | -------------------------------------------- |
| `core`       | logger, logStream, systemControl | created once by `bootstrap()`                |
| `persistent` | persistent services              | created in `system.boot()`, survives reloads |
| `app`        | reloadable services              | swapped out on every reload                  |

Since lookups only go upwards, nothing depends on the app layer. During a hot reload, the app layer is simply swapped for a fresh one.

This is also why a persistent service can't depend on a reloadable one (see [Scopes](#scopes)).

### Folder structure

| Folder      | Responsibility                                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `contract/` | All shared types, interfaces and enums. Contains no logic.                                                                          |
| `di/`       | Dependency injection: tokens, sorting services by their dependencies, resolving them and creating the instances.                    |
| `error/`    | The base `FrameworkError` and all error groups with their typed message templates.                                                  |
| `install/`  | Brings everything together: validates exports, orders them and installs the entries into the registries, with rollback.             |
| `load/`     | The loader that scans a folder and imports all exports.                                                                             |
| `log/`      | The logger and its stream, where custom output can be plugged in.                                                                   |
| `metadata/` | Everything that handles metadata: the decorators and the metadata accessor.                                                         |
| `registry/` | The base registry, the concrete registries, the main registry, registry tokens and the resolver that answers lookups across layers. |
| `util/`     | Small helpers: formatters and type guards.                                                                                          |

### Design decisions

- **Rollback by throwing away a layer.** If a boot fails, the new layer is simply discarded instead of deleting entries one by one, because nothing depends on the layer. Hot reload uses the exact same mechanism.
- **Validate first, then build.** Everything that can be checked upfront is checked before a single service is built. Errors that can't be predicted are handled by a rollback.
- **Everything is a service.** Module services are passed on as normal exports and go through the same installer as app services. Validation, ordering, rollback, lifecycle and scopes work for them without a second code path.
- **Typed error templates.** Placeholders like `{ID}` in a message template are inferred as required arguments, so an error with missing details doesn't compile. Every error has a fixed code that tests can check against.
- **Strict registry names.** A registry only exists for TypeScript once it is added to `RegistryPayloadMap`. There's no fallback for plain strings, so a misspelled registry name is a compile error instead of a runtime error.
- **One public entry point.** Everything public is exported from `cpuy`. The `exports` field in `package.json` blocks access to internal files, so the internals can change without breaking apps.

## Roadmap

1. **Hot reload with state preservation**

   Swap the app layer on file changes and carry state over with `onSnapshot` / `onRestore`.

2. **Terminal module**
   - **Terminal:** wraps terminal-kit and turns every keypress into key events.
   - **Prompt:** the input line with its buffer and command history.
   - **CommandRunner:** runs the matching command from the command registry.
   - **Renderer:** a tree of elements, similar to the DOM, drawn into a screen buffer. Each element draws only into its own area, and elements can be found and manipulated with `getElement()`.

3. **Release on npm**

   The kernel as `cpuy` and the terminal module as a seperate release.

## License

MIT, see [LICENSE](LICENSE).
