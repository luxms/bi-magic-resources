import { BaseService } from '../core';
/**
 * @deprecated
 */
export interface ISearchVM {
    readonly loading: boolean;
    readonly error: string;
    readonly search: string;
}
/**
 * @class
 * @instance
 * @deprecated
 * @description Сервис хранит ввод пользователя в "поиск", используется в Наборе данных. Использует внутри подписку на UrlState (При смене url, search:null) *
 */
export declare class SearchVC extends BaseService<ISearchVM> {
    private readonly _urlState;
    static getInstance: any;
    protected constructor();
    private _updateUrl;
    setSearch(search: string): void;
    protected _dispose(): void;
}
