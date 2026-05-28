import type { IBaseEntities } from './BaseEntitiesService';
import type { IRawDimension } from '../repositories/koob';
import type { CacheableServiceClass } from './createService';

export declare const AutoDimensionsServiceFactory: ({ useService }: {
    useService: any;
}, schema_name: string, cube_ident: string) => IBaseEntities<IRawDimension>;

export declare const AutoDimensionsService: CacheableServiceClass<IBaseEntities<IRawDimension>, any[]>;
export declare const AutoDimensionService: CacheableServiceClass<IRawDimension, any[]>;

export default AutoDimensionsService;
