import {IIdOwner} from "../core/utils/list";
import {BaseService, IBaseEntities} from "../core";

export class TransactionEntitiesService<RAW_ENTITY extends IIdOwner> extends BaseService<IBaseEntities<RAW_ENTITY>> {
    public constructor(ServiceClass: any, ...args: any[])

    public create(partialEntity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>

    /**
     * @description вставить в модель измененный ENTITY
     * @param {number | string} id
     * @param partialEntity
     */
    public updateOne(id: number | string, partialEntity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>

    public commit(): Promise<any>

    public commitMany(): Promise<any>

    /**
     * @description Отменяет все изменения в моделе
     * @method
     */
    public reset(): void;

    public updateMany(partialEntities: Partial<RAW_ENTITY>[], deletedEntities?: number[]): Promise<RAW_ENTITY[]>

    public remove(id: number | string): Promise<void>

    public undoRemove(id: number | string): Promise<void>

    public getCurrentModal(): RAW_ENTITY[]

    /**
     * @description позволяет узнать есть ли изменения в моделе
     * @method
     * @return {boolean}
     */
    public isChanged(): boolean
}
