import { CacheableServiceClass } from './createService';

export interface IAutoDataSourcesModel extends Array<any> {
    error: string | null;
    loading: boolean;
}

/** Loads global and dataset-local data sources depending on available claims. */
export declare const AutoDataSourcesService: CacheableServiceClass<IAutoDataSourcesModel, [string | null]>;

export default AutoDataSourcesService;
