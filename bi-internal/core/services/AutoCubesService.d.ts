import type { IRawCube } from '../repositories/koob';
import type { CacheableServiceClass } from './createService';

type CubesResult = IRawCube[] & {
    error: string | null;
    loading: boolean;
};

export declare const AutoCubesServiceFactory: ({ useService, useServiceItselfWithCustomSubscription }: {
    useService: any;
    useServiceItselfWithCustomSubscription: any;
}, schema_name: string) => CubesResult;

export declare const AutoCubesService: CacheableServiceClass<CubesResult, any[]>;

/**
 * Сервис возвращает один куб или null, если такого куба нет.
 */
export declare const AutoCubeService: CacheableServiceClass<any, [schema_name: string, cubeId: string]>;

export default AutoCubesService;
