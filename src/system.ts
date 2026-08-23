import { MainRegistry } from "#kernel/registry/main-registry";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";
import { Config, Inject } from "#kernel/decorator/index";
import { Service } from "#core/decorator/index";
import { InstanceFactory } from "#core/factory/instance-factory";

export class System {
  constructor(
    private readonly mainRegistry: MainRegistry,
    private readonly registryResolver: RegistryResolver,
  ) {}

  public boot(): void {
    console.log("Hello World!\nDer Test startet nun, viel Glück!");

    this.test();
  }

  public test(): void {
    const expectThrows = (test: () => unknown, name: string): void => {
      try {
        test();
      } catch {
        console.log(`[PASS] ${name}`);
        return;
      }

      throw new Error(`${name} did not throw.`);
    };

    const serviceRegistry = this.mainRegistry.get("serviceRegistry");
    const instanceFactory = new InstanceFactory(this.registryResolver);

    serviceRegistry.register("instanceFactory", instanceFactory);

    if (!this.mainRegistry.has("serviceRegistry"))
      throw new Error("MainRegistry test failed.");
    console.log("[PASS] MainRegistry lookup");

    if (this.mainRegistry.has("missingRegistry"))
      throw new Error("MainRegistry incorrectly found a missing registry.");
    console.log("[PASS] MainRegistry missing registry check");

    expectThrows(
      () => this.mainRegistry.get("missingRegistry" as never),
      "MainRegistry missing registry error",
    );

    expectThrows(
      () => this.mainRegistry.register("serviceRegistry", serviceRegistry),
      "MainRegistry duplicate registry error",
    );

    if (this.registryResolver.find("instanceFactory") !== instanceFactory)
      throw new Error("RegistryResolver test failed.");
    console.log("[PASS] RegistryResolver lookup");

    if (
      this.registryResolver.find("missingService") !== undefined ||
      this.registryResolver.has("missingService")
    )
      throw new Error(
        "RegistryResolver incorrectly resolved a missing service.",
      );
    console.log("[PASS] RegistryResolver missing service check");

    const dynamicBlueprint = instanceFactory.create({
      id: "testBlueprint",
      targetRegistry: "serviceRegistry",
      enabled: true,
    });

    if (dynamicBlueprint.enabled !== true)
      throw new Error("InstanceFactory dynamic blueprint test failed.");
    console.log("[PASS] InstanceFactory dynamic blueprint");

    expectThrows(
      () => instanceFactory.create(null as never),
      "InstanceFactory invalid source error",
    );

    expectThrows(
      () =>
        instanceFactory.create({
          id: "missingTargetRegistry",
        } as never),
      "InstanceFactory invalid dynamic blueprint error",
    );

    @Service({ id: "injectedTestBlueprint" })
    class InjectedTestBlueprint extends BaseBlueprint {
      constructor(
        @Inject("instanceFactory") readonly factory: InstanceFactory,
        @Config() readonly options: Record<string, unknown>,
      ) {
        super(options);
      }
    }

    const options = { enabled: true };
    const classBlueprint = instanceFactory.create(
      InjectedTestBlueprint,
      options,
    );

    if (
      classBlueprint.factory !== instanceFactory ||
      classBlueprint.config !== options
    )
      throw new Error("InstanceFactory class blueprint test failed.");
    console.log("[PASS] InstanceFactory class blueprint with injection");

    @Service({ id: "missingDependencyBlueprint" })
    class MissingDependencyBlueprint extends BaseBlueprint {
      constructor(@Inject("missingService") readonly dependency: unknown) {
        super();
      }
    }

    expectThrows(
      () => instanceFactory.create(MissingDependencyBlueprint, {}),
      "InstanceFactory missing dependency error",
    );

    @Service({ id: "unconfiguredBlueprint" })
    class UnconfiguredBlueprint extends BaseBlueprint {
      constructor(@Config() readonly options: Record<string, unknown>) {
        super(options);
      }
    }

    expectThrows(
      () => instanceFactory.create(UnconfiguredBlueprint, undefined as never),
      "InstanceFactory missing configuration error",
    );
  }
}
