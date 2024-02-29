/// <reference path="../defs/bi.d.ts" />

import {
    tables,
    IColorPair,
    IColorResolver,
    IEntity,
    ITitleResolver,
    IValue,
    IMLPSubspace,
    IDisposable, ISubspace, IAggregate, IMetric, ILocation, IPeriod, IKoobDimension, IKoobMeasure
} from '../defs/bi';
export interface ILookupResponse {
    rows: string[][] | number[][];
    columns: { name: string, title: string, search: string, config?: any }[];
    config?: any;
}

export interface INormZone extends IColorPair {
    readonly id: string;
    readonly normTitle: string;
    readonly title: string;                                                                           // zone title
    readonly color: string;
    readonly bgColor: string;
    readonly hasInf: boolean;
    readonly hasSup: boolean;
    readonly infTitle: string;
    readonly supTitle: string;
    readonly infColor: string;                                                                        // border color
    readonly supColor: string;

    // metric: IMetric;

    hasValue(v: IValue, e?: IEntity): boolean;

    getInfData(): number[];

    getSupData(): number[];

    fake?: boolean;
}


export interface INormsResponse extends IColorResolver, ITitleResolver {
    getZones(): INormZone[];

    getColor(e: IEntity, v: IValue): string;

    getBgColor(e: IEntity, v: IValue): string;

    getColorPair(e: IEntity, v: IValue): IColorPair;

    getTitle(e: IEntity, v: IValue): string;
}


//
// data engine
//
export module data_engine {
    export type IMLPSubscribeCallback = (m: IMetric, l: ILocation, p: IPeriod, v: number) => void;
    export type ISubscribeCallback = (z: IEntity, y: IEntity, x: IEntity, v: number) => void;

    export interface IRawRequest {
        data?: boolean;
        norms?: boolean;
        aggregate?: boolean;
    }

    export interface IRawResponse {
        data?: tables.IDataEntry[];
        norms?: tables.INormDataEntry[];
        aggregate?: IAggregate;
    }

    export interface IRawDataProvider {
        // TODO: remove methods
        getRawData(mlpSubspace: IMLPSubspace, closest?: boolean): Promise<tables.IDataEntry[]>;

        getLookupData(subspace: ISubspace): Promise<ILookupResponse>;

        getKoobData(subspace: ISubspace): Promise<any[]>;

        getRawNorms(mlpSubspace: IMLPSubspace): Promise<tables.INormDataEntry[]>;

        getRawColors(mlpSubspace: IMLPSubspace): Promise<any>;

        getAggregate(subspace: ISubspace): Promise<any>;

        getKoobAggregate(subspace: ISubspace): Promise<any>;

        load(request: IRawRequest, mlpSubspace: IMLPSubspace, closest?: boolean): Promise<IRawResponse>;

        rawSubscribe(mlpSubspace: IMLPSubspace, callback: IMLPSubscribeCallback): IDisposable;
    }

    export interface ICubeProvider {
        getCube(subspace: ISubspace, closest?: boolean): Promise<IValue[][][]>;
    }

    export interface IMatrixProvider {
        getMatrixYX(subspace: ISubspace, closest?: boolean): Promise<IValue[][]>;

        // getMatrixZX(subspace:ISubspace, closest?:boolean):Promise<number[][]>;
        // getMatrixZY(subspace:ISubspace, closest?:boolean):Promise<number[][]>;
    }

    export interface IVectorProvider {
        getVectorX(subspace: ISubspace, closest?: boolean): Promise<IValue[]>;

        getVectorY(subspace: ISubspace, closest?: boolean): Promise<IValue[]>;

        // getVectorZ_Promise(subspace:ISubspace, closest?:boolean):Promise<number[]>;
    }

    export interface IValueProvider {
        getValue(subspace: ISubspace, closest?: boolean): Promise<IValue>;
    }

    export interface INormsProvider {
        getNorms(subspace: ISubspace): Promise<INormsResponse>;
    }

    export interface IColorsProvider {
        // getColors
    }

    export interface IDataProvider extends IRawDataProvider, ICubeProvider, IMatrixProvider, IVectorProvider, IValueProvider, INormsProvider, IColorsProvider {
        subscribe(subspace: ISubspace, callback: ISubscribeCallback): IDisposable;
    }
}


export interface IDataMatrix {
    xs: IEntity[];
    ys: IEntity[];
    z: IEntity;
    normsResponses: INormsResponse[];
    matrix: IValue[][];

    getY(idx: number | string): IEntity;

    getX(idx: number | string): IEntity;

    getVectorY(x: number | IEntity): IValue[];

    getVectorX(y: number | IEntity): IValue[];

    getNormsResponse(y: number | IEntity): INormsResponse;

    hasData(): boolean;

    hasNumericData(): boolean;
}


export interface IDataMatrixProvider {
    setAxes(subspace: ISubspace): Promise<IDataMatrix>;    // TODO: other interface!!!
}


export interface IBiQuery {
    getDataProvider(): data_engine.IDataProvider;

    notifyDataChange?(mid: string, lid: string, pid: string, v: IValue);
}
