/**
 * Сервис следит за одним файлом из ресурсов
 * Обновляется лишь тогда, когда запись в таблице resources о нем поменялась
 * Игнорирует любые другие изменения ресурсов
 *
 * В качестве schema_name можно передать null - тогда будет текущий датасет
 */
import { BaseService, repo } from '../core';
interface IResourceLocator {
    readonly error: string;
    readonly loading: boolean;
    readonly schema_name: string;
    readonly resource: repo.ds.IRawResource;
}
export default class ResourceLocatorService extends BaseService<IResourceLocator> {
    private readonly alt_id;
    readonly MODEL: IResourceLocator;
    private _resourcesService;
    private _schemaName;
    constructor(schema_name: string, alt_id: string);
    protected _dispose(): void;
    private _onUrlStateUpdated;
    private _onResourcesUpdated;
}
interface IResourcesOfDatasetsTreeItem {
    readonly schema_name: string;
    readonly resource: repo.ds.IRawResource;
}
export interface IResourcesOfDatasetsTree extends Array<IResourcesOfDatasetsTreeItem> {
    error: string;
    loading: boolean;
}
/**
 * Основываясь на текущем датасете, и иерархии датасетов (parent_guid) сервис загружает список ресурсов по имени
 *
 *  Сначала ищет ресурс в текущем датасете, в датасете, указанном по parent_guid, его родителю и так далее
 *  в конце ищет в ds_res
 */
export declare const ResourcesOfDatasetsTreeService: any;
export {};
