import { BaseService, IBaseModel, repo } from '../core';
export interface ITopic {
    readonly id: number;
    readonly srt: number;
    readonly title: string;
    readonly datasets: ILocalDataset[];
    readonly config: any;
    readonly images?: any;
}
export interface IDatasetsByTopicsModel extends IBaseModel {
    readonly topics: ITopic[];
    readonly flattenModel: (ILocalDataset | ITopic)[];
    readonly datasets: ILocalDataset[];
}
export interface ILocalDataset extends repo.adm.IRawDataset {
    readonly href: string;
}
/**
 *  этот сервис нужно переписать, очень много обновлений. + продумать функционал удаление топика + триггер у сервера удаление записей у TopicDatasetMapsService
 */
export declare class DatasetsByTopicsService extends BaseService<IDatasetsByTopicsModel> {
    constructor();
    protected _dispose(): void;
    private _modifiedDatasets;
    private _reload;
    moveDataset(currentTopicID: any, currentDataset: any, targetTopicID: any, targetDataset: any): Promise<any>;
    removeDataset(id: any, schema_name: any, guid: any): Promise<void>;
    moveTopic(currentTopicID: any, targetTopicID: any): void;
    renameTopic(topicId: number, title: string): void;
    removeTopic(topicId: any): void;
    addTopic(topic: any): Promise<repo.adm.IRawTopic>;
    _flattenModel(array: any[]): any[];
    filterFlattenModel(searchValue: string): void;
    onItemsChange(items: any): void;
    static getInstance: () => DatasetsByTopicsService;
}
