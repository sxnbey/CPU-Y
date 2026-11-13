import type { KnownRegistries, Logger, OnStart, OnStop } from "../../index.js";

import {
  LOGGER,
  Instance,
  Inject,
  Config,
  decorateFunction,
  registryToken,
} from "../../index.js";

@Instance({ id: "greeter", scope: "persistent" })
export class Greeter implements OnStop {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  public greet(name: string): void {
    this.logger.info(`Moin, ${name}!`);
  }

  public say(text: string): void {
    this.logger.info(text);
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
    @Inject(registryToken("functionRegistry"))
    private readonly registry: KnownRegistries["functionRegistry"],
  ) {}

  public onStart(): void {
    this.greeter.greet(this.config.name);
    this.greeter.say(`Registry: ${this.registry.getName()}`);
  }
}

export const exampleFunction = decorateFunction(
  { id: "exampleFunction" },
  (logger: Logger) => {
    logger.info("Ich logge aus einer dekorierten Funktion!");
  },
);
