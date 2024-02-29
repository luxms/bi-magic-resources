import { IRawCube, IRawDimension } from '../repositories/koob';
import { BaseEntitiesService, IBaseEntities } from './BaseEntitiesService';
export declare class CubesService extends BaseEntitiesService<IRawCube> {
    static readonly MODEL: IBaseEntities<IRawCube>;
    protected constructor();
    static getInstance: () => CubesService;
}
export declare class DimensionsService extends BaseEntitiesService<IRawDimension> {
    private source_ident?;
    private cube_name?;
    static readonly MODEL: IBaseEntities<IRawDimension>;
    protected constructor(source_ident?: string, cube_name?: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (source_ident: string, cube_name: string) => DimensionsService;
}
