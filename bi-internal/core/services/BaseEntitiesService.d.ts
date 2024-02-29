import { IIdOwner } from '../utils/list';
import { BaseService } from '../BaseService';
import { BaseRepository } from '../repositories';
export interface IBaseEntities<RAW_ENTITY extends IIdOwner> extends Array<RAW_ENTITY> {
    loading?: boolean;
    error?: string;
    entities: RAW_ENTITY[];
}
export declare class BaseEntitiesService<RAW_ENTITY extends IIdOwner> extends BaseService<IBaseEntities<RAW_ENTITY>> {
    protected _repo: BaseRepository<RAW_ENTITY>;
    protected _schemaName: string;
    protected _tableName: string;
    protected _model: IBaseEntities<RAW_ENTITY>;
    protected constructor(repo: any);
    protected _shouldCheckAuth(): boolean;
    save(entity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>;
    create(partialEntity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>;
    updateOne(id: number | string, partialEntity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>;
    updateMany(partialEntities: Partial<RAW_ENTITY>[]): Promise<RAW_ENTITY[]>;
    remove(id: number | string): Promise<void>;
    protected _repoListInternal(): Promise<RAW_ENTITY[]>;
    protected _init(): Promise<void>;
    protected _updateModel(partialModel: Partial<IBaseEntities<RAW_ENTITY>>): void;
    protected _create(partialEntity: Partial<RAW_ENTITY>): Promise<RAW_ENTITY>;
    private _updateOne;
    private _updateMany;
    private _remove;
    private _onRtMessage;
    protected _onRtMessageCreate(es: RAW_ENTITY[]): void;
    protected _onRtMessageUpdate(es: RAW_ENTITY[]): void;
    protected _onRtMessageDelete(es: RAW_ENTITY[]): void;
    protected _updateInternalOneEntity(e: RAW_ENTITY): void;
    protected updateInternalManyEntities(es: RAW_ENTITY[]): void;
    protected _deleteInternalOneEntity(id: number | string): void;
    protected _reloadEntityWithId(id: number): Promise<RAW_ENTITY>;
}
