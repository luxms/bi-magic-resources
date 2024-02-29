import { BaseRepository } from './BaseRepository';
export declare type IRawUserConfig = {
    [key: string]: string;
};
export interface IRawUser {
    id: number;
    name: string;
    email: string;
    username: string;
    config?: IRawUserConfig;
}
export declare class UsersRepository extends BaseRepository<IRawUser> {
    constructor();
    protected _filter(e: IRawUser): boolean;
}
export interface IRawDataset {
    id: number;
    guid: string;
    parent_guid: string | null;
    version: string;
    schema_name: string;
    server_id: number;
    owner_user_id: number | null;
    head_dataset_id: number | null;
    title: string;
    description: string;
    src_image_type: string;
    images: {
        source: string;
        '15x15': string;
        '130x130': string;
    };
    srt: number;
    config: any;
    serial: string;
    sqlite_serial: null;
    sqlite_snapshot_id: null;
    logged_since: null;
    sync_cfg: any;
    is_archive: 0 | 1;
    is_visible: 0 | 1;
    is_db_ready: 0 | 1;
    period_spans: any;
    ui_cfg: {
        [key: string]: string;
    };
    depends_on: [];
    postprocess_sql: null;
}
export declare class DatasetsRepository extends BaseRepository<IRawDataset> {
    constructor();
}
export interface IRawTopic {
    id: number;
    parent_id: number | null;
    tree_level: number;
    title: string;
    srt: number;
    dataset_id: number | null;
    src_image_type: null;
    images: {};
    config: any;
}
export declare class TopicsRepository extends BaseRepository<IRawTopic> {
    constructor();
}
export interface IRawTopicDatasetMap {
    id: number;
    topic_id: number;
    dataset_id: number;
    config: any;
    srt: number;
}
export declare class TopicDatasetMapsRepository extends BaseRepository<IRawTopicDatasetMap> {
    constructor();
}
export interface IRawUserGroup {
    id: number;
    title: string;
    config?: IRawUserConfig;
}
export declare class UserGroupsRepository extends BaseRepository<IRawUserGroup> {
    constructor();
}
export interface IRawDataSource {
    id: number;
    ident: string;
    title?: string;
    url?: string;
    login?: string;
    pass?: string;
    config?: any;
}
export declare class DataSourceRepository extends BaseRepository<IRawDataSource> {
    constructor();
}
