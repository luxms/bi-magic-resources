import { BaseService, IBaseEntities } from '../core';
import { IIdOwner } from '../utils/list';
export declare class TransactionEntitiesService<RAW_ENTITY extends IIdOwner> extends BaseService<IBaseEntities<RAW_ENTITY>> {
    private ServiceClass;
    private _nextId;
    private _service;
    private _isChanged;
    private _createdEntities;
    private _updatedEntities;
    private _deletedEntities;
    constructor(ServiceClass: any, ...args: any[]);
    protected _dispose(): void;
    getSchemaName(): string;
    private _onServiceUpdated;
    save(entity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>;
    create: (partialEntity: Partial<RAW_ENTITY>, getNextId?: boolean) => Promise<RAW_ENTITY>;
    private _create;
    /**
     * @description копия приватного метода BaseEntitiesService
     * @param entities
     * @param id
     * @param partialEntity
     * @private
     */
    private _updateOne;
    private __updateOne;
    /**
     * @description вставить в модель измененный ENTITY
     * @param {number | string} id
     * @param partialEntity
     */
    updateOne: (id: number | string, partialEntity: Partial<RAW_ENTITY>) => Promise<RAW_ENTITY>;
    /**
     * @description синхронный метода updateOne (нужен для корректной перерисовки @react)
     * @param {number | string} id
     * @param partialEntity
     */
    updateOneImmediate: (id: number | string, partialEntity: Partial<RAW_ENTITY>) => RAW_ENTITY;
    private _deleteOne;
    remove: (id: number | string) => Promise<void>;
    commit(): Promise<any>;
    commitMany(): Promise<any>;
    undoRemove(id: number | string): Promise<void>;
    private _undoDeleteOne;
    private _createRemoteEntities;
    protected _freezeUpdates(): void;
    updateMany: (partialEntities: Partial<RAW_ENTITY>[], deletedEntities?: number[]) => Promise<RAW_ENTITY[]>;
    /**
     * @description Отменяет все изменения в моделе
     * @method
     */
    reset(): void;
    /**
     * @description позволяет узнать есть ли изменения в моделе
     * @method
     * @return {boolean}
     */
    isChanged(): boolean;
}
