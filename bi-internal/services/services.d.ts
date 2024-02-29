import {BaseService} from '../core';
import {IEntity, tables, } from '../defs/bi'
import {IVizelConfig} from '../defs/types'

export interface IDatasetsListModel {
    readonly loading: boolean;
    readonly error: string;
    readonly datasets: IDatasetsListItem[];
    readonly roots: IDatasetsListItem[];
}
export interface IDatasetsListTile {
    dataset: IDatasetsListItem;
    percentage: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}
export interface IDatasetsListItem extends IEntity {
    id: string;
    guid: string;
    schema_name: string;
    title: string;
    description: string;
    layout: string;
    image: string;
    lastPeriodTitle: string;
    href: string;
    color: string;
    tiles: IDatasetsListTile[];
    bookmarks: any[];             // tables.IBookmark[]
    searchVisible: boolean;       // TODO: remove
    children: IDatasetsListItem[];
    resourcesRoot: string;
    parents: IDatasetsListItem[];
    uiCfg: any;
    deleteBookmark(bookmark: tables.IBookmark);
}
export class DatasetsListService extends BaseService<IDatasetsListModel> {
    public constructor();
    protected _onDepsReadyAndUpdated();
    public static getInstance ():DatasetsListService
}
export const DatasetsListIcon: any;

export interface IRawSummary {
    chats: {
        count: number;
    };
    'datasets': {
        count: number;
    };
    'tasks-to': {
        count: number;
    };
    'tasks-from': {
        count: number;
        active_count: number;
        expired_count: number;
    };
    'tasks-self': {
        count: number;
    };
    presentations: {
        count: number;
    };
    // additional
    ds: {
        count: number;
    };
}

export interface ISummaryModel {
    readonly loading: boolean;
    readonly error: string;
    readonly data: IRawSummary;
}

export class SummaryService extends BaseService<ISummaryModel> {
    private constructor();
    public static getInstance(): SummaryService
}

export function getBookmarks(): Promise<tables.IBookmark[]>;

// deprecated
export function deleteBookmark(bookmark): Promise<any>;


export function createVizelConfig(rawVizelConfig: tables.IRawVizelConfig, defaultSchemaName?: string, view_class?: string): Promise<IVizelConfig> 
