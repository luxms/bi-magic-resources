import { BaseService } from '../core';

type ServiceClass<S extends BaseService<any>> = {
    new(...args: any[]): S;
    createInstance?(...args: any[]): S;
    getInstance?(): S;
};

export declare function useServiceItselfWithCustomSubscription<S extends BaseService<any>>(ServiceClass: ServiceClass<S>, subscription: string | string[], ...args: any): S;
export declare function useServiceItself<S extends BaseService<any>>(ServiceClass: ServiceClass<S>, ...args: any): S;
export declare function useServiceWithCustomSubscription<S extends BaseService<any>>(ServiceClass: ServiceClass<S>, subscription: string | string[], ...args: any): ReturnType<S['getModel']>;
export declare function useService<S extends BaseService<any>>(ServiceClass: ServiceClass<S>, ...args: any): ReturnType<S['getModel']>;
export default useService;
