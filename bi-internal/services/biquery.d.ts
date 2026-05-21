import { data_engine } from '../defs/data-manip';
import { IDatasetModel } from '../defs/types';
import { IMLPSubspace, IPeriod, ISubspace, IValue, responses, tables } from '../defs/bi';

export function makeRequestHashPeriods(ps: IPeriod[], closest?: boolean): any;
export function pushDependencyIds(resultArray: (string | number)[], es: any[]): void;
export function makeRequestHash(mlpSubspace: IMLPSubspace, closest?: boolean): responses.IBiQueryRequestHash;

export class MLPCubeWithRawData {
    public constructor(rawData: tables.IDataEntry[]);
    public forEach(fn: (mid: string, lid: string, pid: string, v: IValue) => void): void;
}

export function makeCube(subspace: ISubspace, rawData: tables.IDataEntry[]): IValue[][][];
export function makeCubeKoob(subspace: ISubspace, rawData: { [id: string]: string | number }[]): IValue[][][];
export function makeCubeLookup(subspace: ISubspace, rawData: any): IValue[][];

/** Network-backed raw data provider used by BI queries. */
export class NetStrategy implements data_engine.IRawDataProvider {
    public constructor(datasetModel: IDatasetModel);
    [key: string]: any;
}
