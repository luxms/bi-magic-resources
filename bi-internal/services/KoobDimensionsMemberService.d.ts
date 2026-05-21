import { BaseService, repo } from '../core';

export interface IKoobDimensionsMemberModel {
    readonly loading: boolean;
    readonly error: string;
    readonly dimensions: IRawDimensionMember[];
}

export interface IRawDimensionMember extends repo.koob.IRawDimension {
    readonly members?: { id: number; title: string }[];
}

/** Loads dimension members lazily for a koob dimension. */
export class KoobDimensionsMemberService extends BaseService<IKoobDimensionsMemberModel> {
    public loadMember(column: string, onlyDefault: boolean, inheritedFilters?: any): Promise<IRawDimensionMember>;
    public static createInstance: (schemaName: string, koob: string) => KoobDimensionsMemberService;
}
