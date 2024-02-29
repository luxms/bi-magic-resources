/**
 *
 *
 *
 */
export interface IRetainable {
    retain(): this;
    release(): boolean;
    lock<T>(fn: () => T): Promise<T>;
}
export declare abstract class Retainable implements IRetainable {
    private __refCount;
    private __disposeTimer;
    retain(): this;
    release(): boolean;
    releaseNextTick(): this;
    /**
     * Memory management: save link to memory until provided function return result or throw error
     *
     *
     * @param {() => any} fn
     * @returns {Promise<any>}
     */
    lock<T>(fn: () => T | Promise<T>): Promise<T>;
    protected abstract _dispose(): void;
}
export declare function memLock(target: object, key: string, descriptor?: TypedPropertyDescriptor<any>): any;
