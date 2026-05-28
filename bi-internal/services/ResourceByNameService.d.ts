import { BaseService, IBaseModel } from '../core';
interface IResourceByNameModel extends IBaseModel {
    readonly schema_name: string;
    readonly content: string;
}
/**
 * @test Написаны тесты!
 *
 * @description Подписываюсь на файл, и в дереве проверяю его. Скачиваю с сервера
 */
export default class ResourceByNameService extends BaseService<IResourceByNameModel> {
    static readonly MODEL: IResourceByNameModel;
    private _resourcesOfDatasetsTreeService;
    private readonly alt_id;
    private _rawResources;
    constructor(alt_id: string);
    protected _dispose(): void;
    private _onResourceUpdated;
}
export {};
