import { BaseService, repo } from '../core';
import { CacheableServiceClass } from './createService';

export interface IResourceLocatorModel {
    readonly error: string;
    readonly loading: boolean;
    readonly schema_name: string;
    readonly resource: repo.ds.IRawResource;
}

export interface IResourcesOfDatasetsTreeItem {
    readonly schema_name: string;
    readonly resource: repo.ds.IRawResource;
}

export interface IResourcesOfDatasetsTree extends Array<IResourcesOfDatasetsTreeItem> {
    error: string;
    loading: boolean;
}

/** Watches one resource in a concrete schema, or in the current dataset when schema is empty. */
export default class ResourceLocatorService extends BaseService<IResourceLocatorModel> {
    public constructor(schema_name: string, alt_id: string);
}

/** Finds resources by name through the current dataset hierarchy and `ds_res`. */
export declare const ResourcesOfDatasetsTreeService: CacheableServiceClass<IResourcesOfDatasetsTree, [string | string[], string?]>;
