import { IDatasetModel, IVizelConfig } from '../defs/types';
import { tables } from '../defs/bi';

export interface IReqCreateVizelConfig {
    readonly cfg: IVizelConfig;
    readonly dataset: IDatasetModel;
}

/**
 * @deprecated Use `createConfig` after resolving a dataset explicitly.
 */
export function createVizelConfig(rawVizelConfig: tables.IRawVizelConfig, defaultSchemaName?: string): Promise<IReqCreateVizelConfig>;

export function createDataset(rawCfg: tables.IRawVizelConfig, defaultSchemaName: string): Promise<IDatasetModel>;
export function createConfig(rawCfg: tables.IRawVizelConfig, dataset: IDatasetModel, context: { schema_name: string; dashboardId?: number | string; dashId?: number | string }): any;
export function cfgDefineProperty(cfg: any, key: string, params: any): void;
export function getterLog(val: any, msg1: string, msg2: string): () => any;
