import type { Logger } from "#kernel/log/logger";
import type { OnStart, OnStop } from "#contract";
import {
  Instance,
  Inject,
  Config,
  decorateFunction,
} from "#kernel/metadata/decorator/index";

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

export const exampleFunction = decorateFunction(
  { id: "exampleFunction" },
  (logger: Logger) => {
    logger.info("Ich logge aus einer dekorierten Funktion!");
  },
);
