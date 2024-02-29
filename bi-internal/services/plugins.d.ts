import {BaseService} from '../core/BaseService'
import {IDatasetModel} from '../defs/types'
import {IVCPV, IDisposable} from '../defs/bi'

export interface IDsToolbarButton {
    loading?: boolean;
    error?: string;
    title: string;
    className?: string;
    href: string;
    icon?: string;
    active?: boolean;
    onPress: (event) => void;
}
export interface IRootSegment {
    title: string;
    url: string;
    bgUrl: string;
    key: string;
    bgColor?: string;
    getTabElementClass?(): any;
    getBodyElementClass?(): any;
    getIcon?(): any;
    tabElementClassCached?: any;    // TODO: move to View class
    bodyElementClassCached?: any;   // TODO: move to View class
}

export interface IPlugin {
    id: string;
    getRootSegments?(): IRootSegment[];
    getDrillDownMenuItems?(ddMenu: any, dataset: IDatasetModel, vcpv: IVCPV, vcpAction?: any): any[];
    subscribeDsToolbarButtons?(dataset: IDatasetModel, cb: (bs: IDsToolbarButton[]) => void, immediateNotify?: boolean): IDisposable;
}

interface IPluginsManagerModel extends Array<IPlugin> {
    loading: boolean;
    error: string | null;
}

export class PluginsManager extends BaseService<IPluginsManagerModel> implements IPlugin {
    public id: string;
    protected constructor();
    public static getInstance(): PluginsManager
    public getRootSegments(): IRootSegment[];
    public getDrillDownMenuItems(ddMenu: any, dataset: IDatasetModel, vcpv: IVCPV, vcpAction?: any): any[];
    public subscribeDsToolbarButtons(dataset: IDatasetModel, cb: (bs: IDsToolbarButton[]) => void, immediateNotify?: boolean): IDisposable;
}