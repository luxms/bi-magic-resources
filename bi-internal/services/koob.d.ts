import { BaseService } from '../core';
import { IKoobDimension, IKoobEntity, IKoobMeasure } from '../defs/bi';

export interface IKoobDataRequest3 {
    options?: string[];
    offset?: number;
    limit?: number;
    sort?: string[];
    subtotals?: string[];
    cancelToken?: any;
    [key: string]: any;
}

export declare function koobDataRequest3(
    koobId: string,
    dimensions: string[],
    measures: string[],
    allFilters: any,
    request?: IKoobDataRequest3,
    comment?: string,
): Promise<any[]>;

export declare function koobCountRequest3(
    koobId: string,
    dimensions: string[],
    measures: string[],
    allFilters: any,
    request?: IKoobDataRequest3,
    comment?: string,
): Promise<any>;

export interface IKoobDataModel {
    loading?: boolean;
    error?: string;
    dimensions: IKoobEntity[];
    measures: IKoobEntity[];
    values: any[];
    sort?: string[];
    subtotals?: string[];
}

export declare class KoobDataService extends BaseService<IKoobDataModel> {
    static koobDataRequest3: typeof koobDataRequest3;
    static koobCountRequest3: typeof koobCountRequest3;
    constructor(koobId: string, dimensions: IKoobEntity[], measures: IKoobEntity[], filters: any, loadBy?: number, sort?: any, subtotals?: string[]);
    abort(): void;
    reload(): void;
    loadItem(n: number): void;
    setSort(sort: string | string[] | null): void;
    setFilter(filters: any): void;
}

export interface IKoob {
    id: string;
    source_ident?: string;
    name?: string;
    title: string;
    sql: string;
    dimensions: IKoobDimension[];
    measures: IKoobMeasure[];
}

export interface IKoobModel {
    id: string;
    config: any;
    loading?: boolean;
    error?: string;
    dimensions: IKoobDimension[];
    measures: IKoobMeasure[];
}

/**
 * @deprecated
 */
export declare class KoobService extends BaseService<IKoobModel> {
    readonly id: string;
    static createInstance(id: string | number): KoobService;
}

export interface IKoobFiltersModel extends Record<string, any> {
    readonly loading?: boolean;
    readonly error?: string;
    readonly value: any;
    /**
     * @deprecated
     */
    readonly filters: any;
    /**
     * @deprecated
     */
    readonly pendingFilters: any;
}

export declare class KoobFiltersService extends BaseService<IKoobFiltersModel> {
    /**
     * Выставляет фильтры, незамедлительно (на самом деле, нет).
     * @param filters фильтры все сразу
     */
    set(filters: { [key: string]: any }): void;
    /**
     * @deprecated
     */
    setFilter(koob: string, column: string, filter?: any[]): void;
    /**
     * @deprecated
     */
    setFilters(koob: string, filters: any): void;
    /**
     * @deprecated
     */
    setPendingFilter: (koob: string, column: string, filter?: any[]) => void;
    /**
     * @deprecated
     */
    setPendingFilters: (koob: string, filters: any) => void;
    /**
     * @deprecated
     */
    applyFilter: () => void;
    /**
     * Применяет фильтр мгновенно, без ожидания.
     * @deprecated
     */
    setFilterImmediate(koob: string, dimension: string, filter?: any[]): void;
    /**
     * Применяет набор фильтров мгновенно, без ожидания.
     * @deprecated
     */
    setFiltersImmediate(koob: string, filters: any): void;
    toggleFilters(koob: string, newFilters: Record<string, any[] | undefined>): void;
    static getInstance(): KoobFiltersService;
}
