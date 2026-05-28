import { BaseService } from '../core';
export declare class PendingService<S> extends BaseService<S> {
    private readonly THROTTLE_TIMEOUT;
    protected _service: BaseService<S>;
    protected _isChanged: boolean;
    constructor(ServiceClass: any, ...args: any[]);
    private _onServiceUpdated;
    set(value: Record<string, any>): void;
    apply: () => void;
    private _set;
    private __set;
    isChanged(): boolean;
    reset(): void;
}
export declare class ApplybleService<S> extends PendingService<S> {
    constructor(ServiceClass: any, ...args: any[]);
    set(value: Record<string, any>): void;
}
