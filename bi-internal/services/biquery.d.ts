import { data_engine, INormsResponse } from '../defs/data-manip';
import { IDatasetModel } from '../defs/types';
import { IDisposable, IMLPPtrCube, IMLPSubspace, IPeriod, ISubspace, IValue, responses } from '../defs/bi';
import * as tables from '../defs/tables';
import { ILookupResponse } from '../defs/data-manip';
type IBiQueryRequestHash = responses.IBiQueryRequestHash;
export declare function makeRequestHashPeriods(ps: IPeriod[], closest?: boolean): any;
export declare function pushDependencyIds(resultArray: (string | number)[], es: any[]): void;
export declare function makeRequestHash(mlpSubspace: IMLPSubspace, closest?: boolean): IBiQueryRequestHash;
export declare class MLPCubeWithRawData implements IMLPPtrCube {
    private __rawData;
    constructor(__rawData: tables.IDataEntry[]);
    forEach(fn: (mid: string, lid: string, pid: string, v: IValue) => void): void;
}
export declare function makeCube(subspace: ISubspace, rawData: tables.IDataEntry[]): IValue[][][];
export declare function makeCubeKoob(subspace: ISubspace, rawData: {
    [id: string]: string | number;
}[]): IValue[][][];
export declare function makeCubeLookup(subspace: ISubspace, rawData: ILookupResponse): IValue[][];
export declare function isEmptyMLPSubspace(mlpSubspace: IMLPSubspace): boolean;
export declare class NetStrategy implements data_engine.IRawDataProvider {
    protected _datasetKey: string;
    protected _datasetModel: IDatasetModel;
    constructor(datasetModel: IDatasetModel);
    protected getRequestUrl(): string;
    private _processMKeysNorms;
    _getBiQueryRawData<T extends tables.IDataEntry>(url: string, mlpSubspace: IMLPSubspace, closest?: boolean): Promise<T[]>;
    getRawData(mlpSubspace: IMLPSubspace, closest?: boolean): Promise<tables.IDataEntry[]>;
    getRawNorms3(mlpSubspace: IMLPSubspace): Promise<tables.INormDataEntry[]>;
    private static _hasV3Norms;
    getRawNorms(mlpSubspace: IMLPSubspace): Promise<tables.INormDataEntry[]>;
    getAggregate(mlpSubspace: IMLPSubspace, closest?: boolean): Promise<any>;
    load(request: data_engine.IRawRequest, mlpSubspace: IMLPSubspace, closest?: boolean): Promise<data_engine.IRawResponse>;
    getRawColors(mlpSubspace: IMLPSubspace): Promise<{
        loc_id: string | number;
        metric_id: string | number;
        period_id: string;
        color: string;
    }[]>;
    rawSubscribe(mlpSubspace: IMLPSubspace, callback: data_engine.IMLPSubscribeCallback): IDisposable;
    private _getKoobDataSubtotal;
    getKoobData(subspace: ISubspace): Promise<any[]>;
    /**
     * @test Написаны тесты.
     *
     * @param {ISubspace} subspace
     */
    getKoobAggregate(subspace: ISubspace): Promise<{
        minval: number;
        maxval: number;
    }>;
    getLookupData(subspace: ISubspace): Promise<ILookupResponse>;
}
export declare class DataProvider implements data_engine.IDataProvider {
    private __decoratee;
    subscribeFn: any;
    constructor(rawDataProvider: data_engine.IRawDataProvider);
    getRawData(subspace: ISubspace, closest?: boolean): Promise<tables.IDataEntry[]>;
    getRawColors(mlpSubspace: IMLPSubspace): Promise<tables.IDataEntry[]>;
    getRawNorms(mlpSubspace: IMLPSubspace): Promise<tables.INormDataEntry[]>;
    getAggregate(subspace: ISubspace): Promise<any>;
    getKoobAggregate(subspace: ISubspace): Promise<any>;
    getKoobData(subspace: ISubspace): Promise<any[]>;
    getLookupData(subspace: ISubspace): Promise<ILookupResponse>;
    load(request: data_engine.IRawRequest, mlpSubspace: IMLPSubspace, closest?: boolean): Promise<data_engine.IRawResponse>;
    rawSubscribe(mlpSubspace: IMLPSubspace, callback: data_engine.IMLPSubscribeCallback): IDisposable;
    getCube(subspace: ISubspace, closest?: boolean): Promise<IValue[][][]>;
    private getLookupMatrixYX;
    getKoobMatrixYX(subspace: ISubspace): Promise<IValue[][][]>;
    getMatrixYX(subspace: ISubspace, closest?: boolean): Promise<IValue[][]>;
    getVectorX(subspace: ISubspace, closest?: boolean): Promise<IValue[]>;
    getVectorY(subspace: ISubspace, closest?: boolean): Promise<IValue[]>;
    getTotalVector(subspace: ISubspace): Promise<IValue[]>;
    getValue(subspace: ISubspace, closest?: boolean): Promise<IValue>;
    subscribe(subspace: ISubspace, callback: data_engine.ISubscribeCallback): IDisposable;
    getNorms(subspace: ISubspace): Promise<INormsResponse | any>;
}
export declare class BiQuery {
    private __dataProvider;
    private __subscribePairs;
    constructor(data: tables.IDataEntry[], datasetModel: IDatasetModel);
    getDataProvider(): DataProvider;
    notifyDataChange(mid: string, lid: string, pid: string, v: number): void;
}
export {};
