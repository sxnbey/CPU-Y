# CPU-Y ![Status](https://img.shields.io/badge/Status-Work_in_progress-yellow)

![Tech-Stack](https://skillicons.dev/icons?i=ts,nodejs)

CPU-Y ist ein TypeScript-Framework für Terminal-Apps mit Dependency Injection, Lifecycle und Hot Reload mit State-Preservation.

> **Work in progress:** Fundament steht, Hot Reload und das Terminal-Modul sind in Arbeit.

## Status

**Läuft**

- **Dependency Injection** über Decorators (`@Instance`, `@Inject`, `@Config`). Abhängigkeiten werden sortiert und Zyklen erkannt.
- **Rollback-Installation**: Wirft ein Service beim Bau einen Fehler, werden alle schon gebauten wieder entfernt.
- **Lifecycle** mit `onStart` & `onStop`-Hooks: Gestartet wird in Abhängigkeitsreihenfolge, gestoppt wird rückwärts. Wirft ein `onStart`, werden die schon gestarteten Services wieder gestoppt.
- **Module**: Erweiterungen mit eigenen Registries und Services.
- **Scopes**: `persistent` Services überleben einen Reload, alle anderen werden neu gebaut.
- **Strikt typisierte und detaillierte Fehlermeldungen** mit Datei, Export, Ursachenkette und Lösungsvorschlag.
- **Loader**: lädt alle Exporte aus einem Ordner, ohne dass sie einzeln registriert werden müssen.

**In Arbeit**

- Hot Reload mit State-Preservation (`onSnapshot` & `onRestore`)
- Terminal-Modul (Input, Commands, Renderer)

## Beispiel

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

Ausgabe:

```
[info \ CPU-Y / 2026-11-01T19:59:54.260Z] - Moin, senbey!
[info \ CPU-Y / 2026-11-01T19:59:54.263Z] - Tschüss!
```

## Konzepte

### Services

Ein Service ist eine Klasse oder Funktion, die das Framework aufbaut und verwaltet. Jeder Service hat eine **eindeutige** `id`.

```typescript
@Instance({ id: "greeter" })
export class Greeter { … }

export const formatGreeting = decorateFunction({ id: "formatGreeting" }, (text: string) => { … });
```

Funktionen müssen mit `decorateFunction` dekoriert werden, weil `@Decorator` nicht auf normalen Funktionen angewendet werden können.

Abhängigkeiten werden im Constructor angegeben:

- `@Inject("id")`: ein anderer Service
- `@Config()`: die Konfiguration aus `bootstrap({ configs: { … } })`, nur einmal pro Service

Ein Parameter ohne Decorator führt zu einem Fehler, außer er ist der am Ende stehende Parameter und hat einen Standardwert.
Exporte ohne `@Instance` oder `decorateFunction()` werden ignoriert, also können auch andere Funktionen, Konstanten etc. in den Dateien liegen.

### Scopes

Der Scope eines Services bestimmt, wie lange er lebt.

- `reloadable` (Default): Wird bei jedem Reload neu gebaut.
- `persistent`: Bleibt nach Reload bestehen.

```typescript
@Instance({ id: "evoMortar", scope: "persistent" })
```

Persistente Services liegen deswegen auch in einer höheren Schicht, damit die reloadable Schicht einfach ausgetauscht werden kann.

Ein persistenter Service kann auch **nicht** von einem reloadable Service abhängen, da er sonst sein Leben lang eine veraltete Version festhält, auch wenn die Abhängigkeit schon mehrmals neu geladen wurde. Andersherum geht es aber problemlos.

### Lifecycle

Services können optional `onStart()` und `onStop()`-Hooks implementieren, synchron oder `async`.

```typescript
@Instance({ id: "database" })
export class Database implements OnStart, OnStop {
  async onStart() {
    /* Verbindung aufbauen */
  }

  async onStop() {
    /* Verbindung schließen */
  }
}
```

- **Start**: in Abhängigkeitsreihenfolge. Ein Service kann erst starten, wenn all seine Abhängigkeiten schon gestartet sind. Persistente Services starten vor den reloadable.

- **Stopp**: in umgekehrter Reihenfolge, heißt erst die reloadable und anschließend die persistenten.

**Verhalten bei Fehlern:**

- `onStart()`: alle gestarteten Services werden gestoppt, `boot()` wirft einen `LifecycleError` mit dem ursprünglichen Fehler als `cause`.

- `onStop()`: der Fehler wird geloggt, die weiteren Services werden trotzdem gestoppt.

### Module

Ein Modul erweitert das Framework um weitere Registries und Services. Modul-Services sind ganz normale Services mit Decoratorn, Scope und Lifecycle.

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

Modul-Services können auch als Abhängigkeit genutzt werden und Exporte mit dem Ziel einer Modul-Registry landen auch dort.

**`modules` & `overrides` Unterschiede**

- `modules` ergänzt: neue Registries und Services als Erweiterung zum Framework.
- `overrides` ersetzt Teile des Kerns, zum Beispiel ein eigener Logger:

```typescript
bootstrap({ path, overrides: { logger: CustomLogger } });
```

## Architektur
