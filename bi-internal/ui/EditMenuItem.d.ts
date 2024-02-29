import { IMLPV } from '../defs/bi';
import {IDatasetModel} from '../defs/types'

export class MenuItem {
    public title: string;
    public action: any;
    public constructor(dataset: IDatasetModel, title: string, action: any) 
}


export class EditMenuItem extends MenuItem {
    public isText: boolean;
    public constructor(dataset: IDatasetModel, mlpv: IMLPV, action: any)
}