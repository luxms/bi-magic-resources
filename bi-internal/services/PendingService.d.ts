import { BaseService, IBaseModel } from '../core';

/** Keeps local edits in a pending model and throttles writes to the wrapped service. */
export class PendingService<S extends IBaseModel = IBaseModel> extends BaseService<S> {
    public constructor(ServiceClass: any, ...args: any[]);
    public set(value: Record<string, any>): void;
    public apply(): void;
    public isChanged(): boolean;
    public reset(): void;
}

/** Pending service variant that writes only when `apply` is called. */
export class ApplybleService<S extends IBaseModel = IBaseModel> extends PendingService<S> {
    public constructor(ServiceClass: any, ...args: any[]);
    public set(value: Record<string, any>): void;
}
