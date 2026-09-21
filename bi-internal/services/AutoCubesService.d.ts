import type { CacheableServiceClass } from './createService';
import type { IRawCube } from '../core/repositories/koob';

type CubesResult = IRawCube[] & {
    error: string | null;
    loading: boolean;
};

export declare const AutoCubesServiceFactory: ({ useService, useServiceItselfWithCustomSubscription }: {
    useService: any;
    useServiceItselfWithCustomSubscription: any;
}, schema_name: string) => CubesResult;
export declare const AutoCubesService: CacheableServiceClass<CubesResult, any[]>;
export declare const AutoCubeService: CacheableServiceClass<any, [schema_name: string, cubeId: string]>;
export default AutoCubesService;
