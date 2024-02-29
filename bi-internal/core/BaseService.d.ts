/**
 *
 *
 *
 */
import { Observable, IDisposable } from './Observable';
export declare function disposeAll(subscriptions: IDisposable[]): void;
export interface IBaseModel {
    error?: string | null;
    loading?: boolean | number;
}
declare type IDepsModels = {
    [id: string]: any;
};
export declare class BaseService<M extends IBaseModel> extends Observable {
    protected _model: M;
    protected _subscriptions: IDisposable[];
    private _depsWatcher;
    private _hDependenciesNames;
    private _hDepsModels;
    private _initializedInstance;
    constructor(initialModel?: M);
    protected _createInitialModel(): M;
    protected _addDependency(depId: string, dep: BaseService<any>, doImmediateNotify?: boolean): void;
    protected _addDependencies(deps: {
        [id: string]: BaseService<any>;
    }, doImmediateNotify?: boolean): void;
    protected _removeDependency(depId: string, doImmediateNotify?: boolean): void;
    protected _onDepsUpdated(newModels: IDepsModels, prevModels: IDepsModels): boolean;
    protected _onDepsReadyAndUpdated(newModels: any, prevModels: any): void;
    protected _getDependencyModel<T>(depId: string): T;
    protected _updateWithLoading(): void;
    protected _updateWithError(error: string): void;
    protected _updateWithData(partialModel: Partial<M>): void;
    protected _smartUpdate(newModel: M, prevModel: M): M;
    protected _isModelChanged(nextModel: M, currentModel: M): boolean;
    protected _isUpdatesFrozen: boolean;
    protected _freezeUpdates(fn: () => any): any;
    private _notifyUpdate;
    protected _setModel(model: M): void;
    protected _updateModel(partialModel: Partial<M>): void;
    /**
     * Returns if service is ready and has data
     *
     * @returns {boolean}
     */
    isReady(): boolean;
    /**
     * Wait until service in state 'ready' (which means, no error and no loading)
     * return Promise<MODEL>
     *
     * if model signal error, it rejects resulting promise
     *
     * @returns {Promise<MODEL>}
     */
    whenReady(): Promise<M>;
    subscribeAndNotify(event: string, listener: (model: M) => void): IDisposable;
    subscribeUpdates(listener: (model: M) => void): IDisposable;
    subscribeUpdatesAndNotify(listener: (model: M) => void): IDisposable;
    getModel(): M;
    protected _releaseChild(name: string): void;
    protected _dispose(): void;
    static dependency(target: BaseService<any>, key: string, descriptor?: TypedPropertyDescriptor<any>): any;
}
export {};
