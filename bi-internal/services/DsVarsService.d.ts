import { BaseEntitiesService, BaseService, IBaseEntities, IBaseModel } from '../core';
import { CacheableServiceClass } from './createService';

export type VarRawType = 'INT' | 'FLOAT' | 'DATE' | 'DATETIME' | 'JSON';

export interface IRawVar {
    readonly id: number;
    readonly ident: string;
    readonly var_type: VarRawType;
    readonly default_value: number;
    readonly min_value: number;
    readonly max_value: number;
    readonly description: string;
    readonly config: any;
}

export class DatasetVarsService extends BaseEntitiesService<IRawVar> {
    public static readonly MODEL: IBaseEntities<IRawVar>;
    public static createInstance: (id: string | number) => DatasetVarsService;
}

export interface IDsVar extends IRawVar {}

export interface IDsVarsModel extends IBaseModel, Record<string, any> {}

/** Stores and updates dataset variable values for one atlas. */
export class DsVarsService extends BaseService<IDsVarsModel> {
    public static MODEL: IDsVarsModel;
    public static createInstance: (schema_name: number | string) => DsVarsService;
    public set(value: Record<string, any>): void;
}

/** Combines variable values from `ds_res` and the atlas parent hierarchy. */
export declare const AtlasHierarchyValuesService: CacheableServiceClass<IDsVarsModel & { setVar?(name: string, value: any): void }, [string]>;

export interface IVarStreamClasServiceModel extends IBaseModel, Record<string, any> {}

/** Watches a single variable by name and propagates changes to its owning atlas. */
export class VarStreamService extends BaseService<IVarStreamClasServiceModel> {
    public constructor(schemaName: string, varName: string);
    public schemaName: string;
    public varName: string;
    public set(value: any): void;
    public getVar(): IRawVar;
}

/** Returns plain variable values for a dataset hierarchy. */
export function getVars(schemaName: string): Promise<Record<string, unknown>>;
