import { BaseService, IBaseModel, repo } from '../core';

export interface ITopic {
    readonly id: number;
    readonly srt: number;
    readonly title: string;
    readonly datasets: ILocalDataset[];
    readonly config: any;
    readonly images?: any;
}

export interface ILocalDataset extends repo.adm.IRawDataset {
    readonly href: string;
}

export interface IDatasetsByTopicsModel extends IBaseModel {
    readonly topics: ITopic[];
    readonly flattenModel: (ILocalDataset | ITopic)[];
    readonly datasets: ILocalDataset[];
}

/** Groups datasets by admin topics for the root dataset list. */
export class DatasetsByTopicsService extends BaseService<IDatasetsByTopicsModel> {
    public constructor();
    public moveDataset(currentTopicID: any, currentDataset: any, targetTopicID: any, targetDataset: any): Promise<any>;
    public removeDataset(id: any, schema_name: any, guid: any): Promise<void>;
    public moveTopic(currentTopicID: any, targetTopicID: any): void;
    public renameTopic(topicId: number, title: string): void;
}
