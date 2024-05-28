import { IRetainable } from './Retainable';

export declare function createSingleton<T>(factory: () => T, dbgGlobalName?: string): () => T;

export interface IObjectsCache<T extends IRetainable> {
    get(...ids: (string | number)[]): T;
    remove(...ids: (string | number)[]): void;
}

export declare function createObjectsCache<T extends IRetainable>(factory: (...ids: any[]) => T, dbgGlobalName?: string): IObjectsCache<T>;
