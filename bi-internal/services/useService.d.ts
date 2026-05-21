import {BaseService} from '../core/BaseService';

export function useServiceItself<S>(ServiceClass: typeof S, ...args: any): S

export function useService<S extends BaseService<any>>(ServiceClass: typeof S, ...args: any): ReturnType<S['getModel']>

/**
 * React hook that returns the service instance and subscribes to named events.
 */
export function useServiceItselfWithCustomSubscription<S extends BaseService<any>>(ServiceClass: typeof S, subscription: string | string[], ...args: any): S

/**
 * React hook that returns the current service model and subscribes to named events.
 */
export function useServiceWithCustomSubscription<S extends BaseService<any>>(ServiceClass: typeof S, subscription: string | string[], ...args: any): ReturnType<S['getModel']>

export default useService;
