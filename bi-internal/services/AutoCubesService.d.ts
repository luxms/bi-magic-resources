import {BaseEntitiesService, IBaseEntities} from "../core";
import {IRawCube} from "../core/repositories/koob";

export declare class AutoCubesService extends BaseEntitiesService<IRawCube> {
    static readonly MODEL: IBaseEntities<IRawCube>;
    protected constructor();
    static getInstance: (schema_name:string) => AutoCubesService;
}
