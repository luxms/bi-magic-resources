import { BaseService, repo } from '../core';
import IRawDimension = repo.koob.IRawDimension;
interface IKoobDimensionsMemberModel {
    readonly loading: boolean;
    readonly error: string;
    readonly dimensions: IRawDimensionMember[];
}
export interface IRawDimensionMember extends IRawDimension {
    readonly members?: {
        id: number;
        title: string;
    }[];
}
export declare class KoobDimensionsMemberService extends BaseService<IKoobDimensionsMemberModel> {
    private _dimensionsService;
    private readonly _schemaName;
    private readonly _koob;
    private _cancelToken;
    protected constructor(schemaName: string, koob: string);
    protected _dispose(): void;
    private _onDimensionsServiceUpdated;
    /**
     * Загружает список мемберов
     * @param column
     * @param onlyDefault
     * @param inheritedFilters фильтры унаследованные от дэша, которые могут быть переданы в запросе, если в конфиге выставлен true
     */
    loadMember: (column: string, onlyDefault: boolean, inheritedFilters?: any) => Promise<IRawDimensionMember>;
    private static _cache;
    static createInstance: (schemaName: string, koob: string) => KoobDimensionsMemberService;
}
export {};
