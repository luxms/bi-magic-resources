import {BaseEntitiesService, IBaseEntities} from "../core";
import {IRawCube} from "../core/repositories/koob";

export declare class AutoCubesService extends BaseEntitiesService<IRawCube> {
    static readonly MODEL: IBaseEntities<IRawCube>;
    protected constructor();
    static createInstance: (schema_name:string) => AutoCubesService;
}

export declare const AutoCubeService: any;
export default AutoCubesService;
