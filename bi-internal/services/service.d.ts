import type { IDatasetModel, IVizelConfig } from '../defs/types';
import type { IRawVizelConfig, tables } from '../defs/bi';
interface IReqCreateVizelConfig {
    readonly cfg: IVizelConfig;
    readonly dataset: IDatasetModel;
}
/**
 * @deprecated Этот метод уже не используется !!!!!!!!!!!
 * @param rawVizelConfig
 * @param defaultSchemaName
 */
export declare function createVizelConfig(rawVizelConfig: tables.IRawVizelConfig, defaultSchemaName?: string): Promise<IReqCreateVizelConfig>;
export declare function createDataset(rawCfg: IRawVizelConfig, defaultSchemaName: string): Promise<IDatasetModel>;
type IContext = {
    schema_name: string;
    dashboardId?: number | string;
    dashId?: number | string;
};
export declare function createConfig(rawCfg: IRawVizelConfig, dataset: IDatasetModel, context: IContext): any;
export declare function cfgDefineProperty(cfg: any, key: string, params: any): void;
export declare function getterLog(val: any, msg1: string, msg2: string): () => any;
export {};
