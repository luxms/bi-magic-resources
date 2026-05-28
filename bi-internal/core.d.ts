export { ERROR, LOADING, getModelError, isModelLoading } from './core/constants';
export * from './core/singleton';
export * from './core/./Retainable';
export * from './core/./Observable';
export * from './core/./BaseService';
export * from './core/./UrlState/UrlState';
export * from './core/./extractErrorMessage';
export { AppConfig } from './core/./AppConfig';
export { AuthenticationService, IAuthentication } from './core/./AuthenticationService';
export { BaseEntitiesService, IBaseEntities } from './core/./services/BaseEntitiesService';
export { default as createService } from './core/./services/createService';
export type {
    UseService,
    ServiceInstance,
    SingletonServiceClass,
    CacheableServiceClass,
} from './core/./services/createService';
export { default as CanIService } from './core/./services/CanIService';
export { AutoCubesService, AutoCubeService, AutoCubesServiceFactory } from './core/./services/AutoCubesService';
export { AutoDimensionsService, AutoDimensionService, AutoDimensionsServiceFactory } from './core/./services/AutoDimensionsService';
export * from './core/./RtService';
import * as repo from './core/./repositories';
import * as srv from './core/./services';
export { repo, srv };

/** Default export mirrors the runtime `@bi/core` namespace object. */
declare const _default: any;
export default _default;
