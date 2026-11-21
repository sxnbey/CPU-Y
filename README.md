<div align="center"><pre>
___________________ ____ ___         _____.___.
\_   ___ \______   \    |   \        \__  |   |
/    \  \/|     ___/    |   /  ______ /   |   |
\     \___|    |   |    |  /  /_____/ \____   |
 \______  /____|   |______/           / ______|
        \/                            \/
</pre></div>

# CPU-Y

CPU-Y is a TypeScript framework with dependency injection, lifecycle hooks and (soon) hot reload with state preservation. A terminal module will be the first module.

## Why?

I started building an app that displays output in the terminal and I was very annoyed that I had to hardcode so much stuff and used many cheap and hacky solutions. So I started building ways that made building a terminal app much easier for me and it was so much fun that at some point I had a clearer vision: I want to build a framework for terminal apps. Later this project turned more into a universal kernel + a terminal module.

## Status

Foundation works, these are in progress:

- Hot reload with state preservation (`onSnapshot` & `onRestore`)
- Terminal module (input, commands, renderer)

## Requirements

- Node.js 22 or newer
- ES modules: CPU-Y is an ES module, so your project needs `"type": "module"` in its `package.json`.
- TypeScript with these options:

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

### Running the example

```bash
git clone https://github.com/sxnbey/CPU-Y.git
cd CPU-Y
npm install
npm run build
npm start
```

`npm start` runs the example from `src/example/`. During development, `npm run dev` rebuilds on every change and starts the example again. It keeps watching for changes until you stop it with `Ctrl+C`.

### Using CPU-Y in your own project

CPU-Y isn't on npm yet. Until then, it can be added as a local dependency:

```json
"dependencies": {
  "cpuy": "file:../CPU-Y"
}
```

After `npm install`, everything is imported from `cpuy`. CPU-Y has to be built first and rebuilt after every change, or you keep `npm run dev` running in the CPU-Y folder.

> [!NOTE]
> Keep your entry file outside the folder passed to bootstrap(). The loader imports every file in that folder. If your entry file awaits boot() at the top level, it ends up waiting for itself and the process hangs.

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

A service is a class or function that the framework builds and manages. Every service has a unique `id` that can't be empty.

```typescript
@Instance({ id: "greeter" })
export class Greeter { … }

export const formatGreeting = decorateFunction({ id: "formatGreeting" }, (text: string) => { … });
```

Functions are decorated with `decorateFunction()`, because TypeScript decorators can't be applied to plain functions.

Exports without `@Instance`, `decorateFunction()` or `decorateFactory()` are ignored, so helper functions, constants etc. can live in the same files.

**Dependencies of a class**

Dependencies are declared in the constructor:

- `@Inject("id")` or `@Inject(TOKEN)`: another service (see [Tokens](#tokens))
- `@Config()`: the configuration from `bootstrap({ configs: { … } })`, at most once per service

A parameter without a decorator causes an error, unless it comes at the end and has a default value.

**Dependencies of a function**

A function that needs other services is decorated with `decorateFactory()` instead of `decorateFunction()`:

```typescript
export const greet = decorateFactory(
  { id: "greet", deps: [LOGGER] },
  (logger) => (name: string) => logger.info(`Grüße, ${name}!`),
);
```

- The outer function is the factory. It receives the services listed in `deps`, in the same order, and returns the actual function.
- The framework calls the factory once per boot and registers the function it returns.
- `deps` only takes tokens, because the types of the factory's parameters come from them.
- The export is the factory, not the finished function.
- Functions can't receive a configuration.

### Tokens

A token is an id with a type attached. It is declared once with `token<T>()` and used everywhere instead of repeating the string.

```typescript
import { token } from "cpuy";

export const GREETER = token<Greeter>("greeter");

@Instance({ id: GREETER })
export class Greeter { … }
```

```typescript
constructor(@Inject(GREETER) private readonly greeter: Greeter) {}
```

> [!NOTE]
> A token doesn't type a constructor parameter. Parameter decorators can't change the type of a parameter.

A typo in a token is a compile error, a typo in a string is only noticed at boot.

With a token as an `id`, the function's parameters are typed by the token:

```typescript
export const GREET = token<(name: string) => string>("greet");

export const greet = decorateFunction(
  { id: GREET },
  (name) => `Grüße, ${name}!`,
);
```

Returning a number here would be an error, because `GREET` promises a string.

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
@Instance({ id: "greeter", scope: "persistent" })

decorateFunction({ id: "formatGreeting", scope: "persistent" }, …)

decorateFactory({ id: "greet", scope: "persistent", deps: [LOGGER] }, …)
```

A persistent service cannot depend on a reloadable service. Otherwise it would hold on to an outdated instance for its entire lifetime, even after that dependency has been reloaded several times. The other way around works just fine.

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

- Start: in dependency order. A service can only start once all of its dependencies have started. Persistent services start before reloadable ones.

- Stop: in reverse order, meaning reloadable services first, then the persistent ones.

Error handling:

- `onStart()`: all services started so far are stopped, and `boot()` throws a `LifecycleError` with the original error as its `cause`.

- `onStop()`: the error is logged, and the remaining services are still stopped.

> [!NOTE]
> After `system.stop()` the process ends by itself. If it doesn't, a service forgot to clean up something in `onStop()`, like an open connection or a listener on the keyboard.

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

### Layers

Services live in three layers. Each layer can only look up services in itself and in the layers above it.

| Layer        | Contains                         | Lifetime                                     |
| ------------ | -------------------------------- | -------------------------------------------- |
| `core`       | logger, logStream, systemControl | created once by `bootstrap()`                |
| `persistent` | persistent services              | created in `system.boot()`, survives reloads |
| `app`        | reloadable services              | swapped out on every reload                  |

Since lookups only go upwards, nothing depends on the app layer. During a hot reload, the app layer is simply swapped for a fresh one.

This is also why a persistent service can't depend on a reloadable one (see [Scopes](#scopes)).

## License

MIT, see [LICENSE](LICENSE).
