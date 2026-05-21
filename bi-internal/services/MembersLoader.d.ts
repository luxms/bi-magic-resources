import { BaseService, IBaseModel } from '../core';

export interface IMembersLoaderOptions {
    readonly koob: string;
    readonly schema_name: string;
    /** Id of the column used in the member request. */
    readonly column: string;
    readonly globalFilter: any;
    readonly innerFilter?: any;
    readonly sortBy?: string;
}

export interface IMembersLoaderModel extends IBaseModel {
    readonly count: number;
    readonly members: { id: string; title: string; [key: string]: any }[];
    readonly generation: number;
    readonly sortBy: string;
    readonly searchFilter: any;
}

/** Paged loader for koob dimension members. */
export default class MembersLoader extends BaseService<IMembersLoaderModel> {
    public constructor(options: IMembersLoaderOptions);
    public ensureMember(idx: number): void;
    public setSearch(filter: any): void;
    public setSortBy(sortBy: string): void;
}
