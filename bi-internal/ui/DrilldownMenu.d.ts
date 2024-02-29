import {IVizelConfig, IDatasetModel} from '../defs/types';
import {data_engine} from '../defs/data-manip'
import {ISubspacePtr, IVCPV } from "../defs/bi";

export interface IMenuItem {
    title: string;
    action?: (arg: this) => any;
    render?: () => any;
    hidden?: boolean;
}

export class DrilldownMenu {
    public static instance: DrilldownMenu

    public constructor();

    public hide(): void;

    public static hide()

    public static getModalContainer()

    private static _getModalContainer(): Promise<any>

    public show(datasetModel: IDatasetModel, event, vcpv: IVCPV, subspacePtr?: ISubspacePtr, cfg?: IVizelConfig, ...customItems: IMenuItem[]): void
}

