import type { CacheableServiceClass } from './createService';
import type { IBaseEntities } from '../core';
import type { IRawDimension } from '../core/repositories/koob';

export declare const AutoDimensionsServiceFactory: ({ useService }: { useService: any }, schema_name: string, cube_ident: string) => IBaseEntities<IRawDimension>;
export declare const AutoDimensionsService: CacheableServiceClass<IBaseEntities<IRawDimension>, any[]>;
export declare const AutoDimensionService: CacheableServiceClass<IRawDimension, any[]>;
export default AutoDimensionsService;
