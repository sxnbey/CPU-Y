import type { Logger } from "#kernel/log/logger";
import type { OnRestore, OnSnapshot, OnStart, OnStop } from "#contract";

import {
  Instance,
  Inject,
  Config,
  decorateFunction,
} from "#kernel/metadata/decorator/index";

@Instance({ id: "example", scope: "persistent" })
export class Example implements OnStop {
  constructor(@Inject("logger") private readonly logger: Logger) {}

  public log(message: string): void {
    this.logger.info(message);
  }

  public greet(name: string): void {
    this.log(`Moin, ${name}!`);
  }

  public async onStop(): Promise<void> {
    this.logger.info("Tschüss!");
  }
}

@Instance({ id: "secondExample" })
export class SecondExample implements OnStart, OnSnapshot, OnRestore {
  private text = "Text für Reload";

  constructor(
    @Inject("example") private readonly example: Example,
    @Config() private readonly config: { name: string },
    @Inject("exampleFunction")
    private readonly exampleFunc: typeof exampleFunction,
  ) {}

  public async onStart(): Promise<void> {
    this.example.greet(this.config.name);

    this.exampleFunc(this.example["logger"]);
  }

  public onSnapshot(): string {
    return this.text;
  }

  public onRestore(text: unknown): void {
    if (typeof text === "string") {
      this.text = text;

      this.example.log(this.text);
    }
  }
}

export const exampleFunction = decorateFunction(
  { id: "exampleFunction" },
  (logger: Logger) => {
    logger.info("Moin, ich bin eine dekorierte Funktion!");
  },
);
