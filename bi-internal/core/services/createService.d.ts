import type { IDisposable } from '../Observable';

type AnyServiceClassLike<M = any> = {
    prototype: {
        getModel(): M;
    };
};

/**
 * The callable dependency object passed as the first argument to createService callbacks.
 */
export interface UseService {
    <M = any>(serviceClass: AnyServiceClassLike<M>, ...args: any[]): M;
    useService: UseService;
    useServiceItself<SC extends AnyServiceClassLike>(serviceClass: SC, ...args: any[]): SC['prototype'];
    useServiceWithCustomSubscription<M = any>(serviceClass: AnyServiceClassLike<M>, subscription: string | string[], ...args: any[]): M;
    useServiceItselfWithCustomSubscription<SC extends AnyServiceClassLike>(serviceClass: SC, subscription: string | string[], ...args: any[]): SC['prototype'];
    useMemberFunction(name: string, fn: () => unknown): void;
}

export interface ServiceInstance<M> {
    getModel(): M;
    subscribeUpdates(listener: (model: M) => void): IDisposable;
    subscribeUpdatesAndNotify(listener: (model: M) => void): IDisposable;
    subscribe(event: string | string[], listener: (...args: any[]) => any): IDisposable;
    unsubscribe(listener: (...args: any[]) => any): boolean;
    whenReady(): Promise<M>;
    isReady(): boolean;
    release(): void;
}

export type SingletonServiceClass<M> = {
    new(): ServiceInstance<M>;
    prototype: ServiceInstance<M>;
    MODEL: M;
    getInstance(): ServiceInstance<M>;
};

export type CacheableServiceClass<M, ARGS extends any[]> = {
    new(...args: ARGS): ServiceInstance<M>;
    prototype: ServiceInstance<M>;
    MODEL: M;
    createInstance(...args: ARGS): ServiceInstance<M>;
};

declare function createService<M>(name: string, callback: () => M | Promise<M>): SingletonServiceClass<M>;
declare function createService<M>(name: string, callback: (dep: UseService) => M | Promise<M>): SingletonServiceClass<M>;
declare function createService<M, ARGS extends any[] = any[]>(name: string, callback: (dep: UseService, ...args: ARGS) => M | Promise<M>): CacheableServiceClass<M, ARGS>;

export default createService;
