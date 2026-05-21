import { BaseService } from '../core';
import { IDatasetModel } from '../defs/types';
import { IDisposable, IVCPV } from '../defs/bi';
import { IDsToolbarButton, IPlugin, IRootSegment } from './plugins';

/** Base implementation for BI plugins with empty extension points. */
export class BasePlugin implements IPlugin {
    public id: string;
    public getRootSegments?(): IRootSegment[];
    public getDrillDownMenuItems(ddMenu: any, dataset: IDatasetModel, vcpv: IVCPV, vcpAction?: any): any[];
    public createVCDsToolbarButtons(dataset: IDatasetModel): BaseService<IDsToolbarButton>[];
    public subscribeDsToolbarButtons(dataset: IDatasetModel, cb: (bs: IDsToolbarButton[]) => void, immediateNotify?: boolean): IDisposable;
}
