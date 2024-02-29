import { BaseEntitiesService, IBaseEntities } from './BaseEntitiesService';
import { DatasetsRepository, DataSourceRepository, IRawDataset, IRawDataSource, IRawTopic, IRawTopicDatasetMap, IRawUser, IRawUserGroup, TopicDatasetMapsRepository, TopicsRepository, UserGroupsRepository, UsersRepository } from '../repositories/adm';
export declare class UsersService extends BaseEntitiesService<IRawUser> {
    protected _repo: UsersRepository;
    static readonly MODEL: IBaseEntities<IRawUser>;
    protected constructor();
    static getInstance: () => UsersService;
}
export declare class DatasetsService extends BaseEntitiesService<IRawDataset> {
    protected _repo: DatasetsRepository;
    static readonly MODEL: IBaseEntities<IRawDataset>;
    protected constructor();
    static getInstance: () => DatasetsService;
}
export declare class TopicsService extends BaseEntitiesService<IRawTopic> {
    protected _repo: TopicsRepository;
    static readonly MODEL: IBaseEntities<IRawTopic>;
    protected constructor();
    static getInstance: () => TopicsService;
}
export declare class TopicDatasetMapsService extends BaseEntitiesService<IRawTopicDatasetMap> {
    protected _repo: TopicDatasetMapsRepository;
    static readonly MODEL: IBaseEntities<IRawTopicDatasetMap>;
    protected constructor();
    static getInstance: () => TopicDatasetMapsService;
}
export declare class UserGroupsService extends BaseEntitiesService<IRawUserGroup> {
    protected _repo: UserGroupsRepository;
    static readonly MODEL: IBaseEntities<IRawUserGroup>;
    protected constructor();
    static getInstance: () => UserGroupsService;
}
export declare class DataSourcesService extends BaseEntitiesService<IRawDataSource> {
    protected _repo: DataSourceRepository;
    static readonly MODEL: IBaseEntities<IRawDataSource>;
    protected constructor();
    static getInstance: () => DataSourcesService;
}
