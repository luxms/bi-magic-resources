import {IRawDimension} from "../core/repositories/koob";
import {BaseEntitiesService, IBaseEntities} from "../core";

export declare class AutoDimensionsService extends BaseEntitiesService<IRawDimension> {
    static readonly MODEL: IBaseEntities<IRawDimension>;
    protected constructor(source_ident?: string, cube_name?: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (schema_name: string, koob: string) => AutoDimensionsService;
}
