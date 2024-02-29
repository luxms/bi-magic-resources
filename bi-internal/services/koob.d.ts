import {BaseService} from '../core/BaseService';
import {IKoobDimension, IKoobMeasure} from '../defs/bi'

export interface Cancel {
    message: string;
}
export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}

export interface IKoobDataModel {
    loading?: boolean;
    error?: string;
    dimensions: IKoobDimension[];
    measures: IKoobMeasure[];
    values: any[];
    sort?: string[];
    subtotals?: string[];
}
interface IKoobDataRequest3 {
    options?: string[];
    offset?: number;
    limit?: number;
    sort?: string[];
    subtotals?: string[];
    cancelToken?: CancelToken;
}
export function koobDataRequest3(koobId: string,
                                       dimensions: string[],
                                       measures: string[],
                                       allFilters: any,
                                       request?: IKoobDataRequest3,
                                       comment?: string):Promise<any[]>

export function koobCountRequest3(koobId: string,
                                        dimensions: string[],
                                        measures: string[],
                                        allFilters: any,
                                        request?: IKoobDataRequest3,
                                        comment?: string)

export class KoobDataService extends BaseService<IKoobDataModel> {
    public static koobDataRequest3: typeof koobCountRequest3;
    public static koobCountRequest3: typeof koobCountRequest3;

    public constructor(koobId: string,
                       dimensions: IKoobDimension[],
                       measures: IKoobMeasure[],
                       filters: any,
                       loadBy?: number,
                       sort?: any,
                       subtotals?: string[])


    public abort(): void

    public reload(): void

    public loadItem(n: number): void

    public setSort(sort: string | string[] | null): void

    public setFilter(filters: any): void
}

export interface IKoobModel {
    id: string;
    config: any;
    loading?: boolean;
    error?: string;
    dimensions: IKoobDimension[];
    measures: IKoobMeasure[];
}

export class KoobService extends BaseService<IKoobModel> {
    public readonly id: string;
    private constructor(koobId: string);
    public loadEntityDetails(entityId: string): Promise<void>
    public static createInstance(id: string | number):KoobService
}

export interface IKoobFiltersModel {
    loading?: boolean;
    error?: string;
    query?: string;
    result: any;
    filters: any;
    pendingFilters: any;
}

export class KoobFiltersService extends BaseService<IKoobFiltersModel> {
    private constructor();

    public static getInstance(): KoobFiltersService

    public setDimensionFilter(koob: string, dimension: string, filter?: string[]): void;

    public setFilter(koob: string, dimension: string, filter?: any[]): void;

    public setFilters(koob: string, newFilters: any):void;

    public applyDimensionFilter(dimension: string, value: string | number, toggleFlag: boolean, allValues: (string | number)[]):void

    public applyPeriodsFilter(dimension: string, lodate: string | number, hidate: string | number):void
}
