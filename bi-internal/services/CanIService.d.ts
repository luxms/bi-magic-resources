import {BaseService, IBaseModel, IDisposable} from "../core";

type CanIModel = IBaseModel & Record<string, boolean>;

/**
 * @instance
 * @service
 * @description Сервис позволяющий накапливать, сохранять и получать claim'ы с сервера.
 */
export class CanIService extends BaseService<CanIModel> {
    public constructor();
    public static getInstance: CanIService;

    /**
     * @method
     * @param {string} claim - единичный запрос типа "R adm.datasets/ds_xx".
     * @return {Promise<boolean>} - возвращает з-ние клейма.
     */
    public one(claim: string): Promise<boolean>;

    /**
     * @method
     * @param {string[]} claims - массив запрос типа ["R adm.datasets/ds_x1", "R adm.datasets/ds_x1"...]
     * @return {Promise<CanIModel>} - возвращает млодель типа {[claim:string]:boolean}.
     */
    public ensure(claims: string[]): Promise<CanIModel>;

    /**
     * @method
     * @param {string} claim - проверяет зн-ие в моделе (<CanIModel>) этот клейм типа "R adm.datasets/ds_x1"
     * @return {boolean}
     */
    public can(claim: string): boolean;

    /**
     * @static
     * @param {string} claim - проверяет зн-ие в моделе (<CanIModel>) этот клейм типа "R adm.datasets/ds_x1"
     * @return {boolean}
     */
    public static can (claim: string): boolean;

    /**
     * @static
     * @param {string} claim - единичный запрос типа "R adm.datasets/ds_xx".
     * @return {Promise<boolean>} - возвращает з-ние клейма.
     */
    public static one(claim: string): Promise<boolean>;

    /**
     * @static
     * @param {string[]} claims - массив запрос типа ["R adm.datasets/ds_x1", "R adm.datasets/ds_x1"...]
     * @return {Promise<CanIModel>} - возвращает млодель типа {[claim:string]:boolean}.
     */
    public static ensure(claims: string[]): Promise<CanIModel>;

    public static getModel(): CanIModel;

    public static subscribeUpdatesAndNotify(listener: (model: CanIModel) => void): IDisposable;

    public static unsubscribe(listener: (...args: any[]) => any): boolean;
}

