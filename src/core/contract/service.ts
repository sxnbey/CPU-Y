import type { IBaseMetadata } from "#kernel/contract/index";

export interface IServiceMetadata extends IBaseMetadata {}

export type ServiceOptions = Pick<IServiceMetadata, "id">;
