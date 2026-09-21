import { BaseService, repo, type IBaseModel } from '../core';

export interface IRawVar {
    readonly id?: string | number;
    readonly name?: string;
    readonly title?: string;
    readonly config?: any;
    readonly value?: any;
    readonly [key: string]: any;
}

export declare const DatasetVarsService: any;
export interface IDsVar extends IRawVar {
}
export interface IDsVarsModel extends IBaseModel, Record<string, any> {
}
/**
 * Хранит значения переменных от одного атласа
 */
export declare class DsVarsService extends BaseService<IDsVarsModel> {
    static MODEL: IDsVarsModel;
    private readonly _schemaName;
    private _datasetVarsService;
    private constructor();
    protected _dispose(): void;
    private _init;
    private _onServiceUpdate;
    private _onUrlUpdate;
    private _extractVarsValuesFromUrl;
    set(values: Record<string, any>): void;
    private _saveUserConfigValues;
    private static _cache;
    static createInstance: (schema_name: number | string) => DsVarsService;
}
/**
 * Сервис собирает все значения переменных по иерархии атласов и выдает их в одном сборном хэшмапе
 */
export declare const AtlasHierarchyValuesService: any;
export interface IVarStreamClasServiceModel extends IBaseModel, Record<string, any> {
}
/**
 * # VarStreamService
 * Этот сервис наблюдает за одной лишь переменной по ее имени и атласу
 */
export declare class VarStreamService extends BaseService<IVarStreamClasServiceModel> {
    schemaName: string;
    varName: string;
    private _schemaNames;
    constructor(schemaName: string, varName: string);
    private _onServiceUpdate;
    private _updateDsVar;
    set(value: any): void;
    getVar(): IRawVar;
    private _subscribeSchemaNames;
    private _unSubscribeSchemaNames;
    protected _dispose(): void;
}
/**
 * @description просто получаю все atlas.vars у датасета
 * @param schemaName
 */
export declare function getVars(schemaName: string): Promise<Record<string, unknown>>;
export declare function generateAtlasVarsUrn(schema_name: string, rawVar: IRawVar): string;
