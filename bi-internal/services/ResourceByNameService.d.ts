import { BaseService, IBaseModel } from '../core';

export interface IResourceByNameModel extends IBaseModel {
    readonly schema_name: string;
    readonly content: string;
}

/** Resolves a resource by alt_id and downloads its content when the resource changes. */
export default class ResourceByNameService extends BaseService<IResourceByNameModel> {
    public constructor(alt_id: string);
}
