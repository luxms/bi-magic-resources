import {BaseService} from '../core/BaseService';

export function useServiceItself<S>(ServiceClass: typeof S, ...args: any): S

export function useService<S extends BaseService<any>>(ServiceClass: typeof S, ...args: any): ReturnType<S['getModel']>