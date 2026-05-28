import { BaseService, IBaseModel } from '../BaseService';
import type { IDisposable } from '../Observable';

type CanIModel = IBaseModel & Record<string, string | boolean>;

/**
 * @instance
 * @service
 * @description Сервис позволяющий накапливать, сохранять и получать claim'ы с сервера.
 */
declare class CanIService extends BaseService<CanIModel> {
    static MODEL: CanIModel;
    constructor();
    one(claim: string): Promise<boolean>;
    ensure(claims: string[]): Promise<CanIModel>;
    can: (claim: string) => boolean;
    static can: (claim: string) => boolean;
    static one(claim: string): Promise<boolean>;
    static ensure(claims: string[]): Promise<CanIModel>;
    static getModel(): CanIModel;
    static subscribeUpdatesAndNotify(listener: (model: CanIModel) => void): IDisposable;
    static unsubscribe(listener: (...args: any[]) => any): boolean;
    /**
     * Для дебугинга.
     * @param pattern часть claim для поиска, например "ds_23689.dashboards/94"
     */
    helpFindClaim(pattern: string): void;
    static getInstance: () => CanIService;
}

export default CanIService;
