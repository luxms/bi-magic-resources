import {BaseService} from '../core/BaseService';

/**
 *
 *  This View Controller is implemented as singleton
 *   as it should be the one for the whole app
 *   and must be accessible from everywhere
 *
 */
export interface IPopupMenuItem {
    title: string;
    onPress: () => void;
}


export interface IPopupPosition {
    left?: number;
    top?: number;
    right?: number;
}


export interface IPopupVM extends IPopupPosition {
    loading?: boolean;
    error?: string;
    visible: boolean;
    // content
    dialogVM: any;
    description: string;
    menuItems: IPopupMenuItem[];
    // events
    onClose: () => void;
}


export class PopupVC extends BaseService<IPopupVM> {
    
    private constructor();
    
    public static getInstance(): PopupVC;

    public showDialog(dlgVC: any, position: IPopupPosition, onClose?: any): void;

    public hideDialog(dlgVC: any): void;

    public showDescription(description: string, position: IPopupPosition): void;

    public toggleDescription(description: string, position: IPopupPosition): void;

    public showContextMenu(menuItems: IPopupMenuItem[], position: IPopupPosition): void;

    public static hideDialog(dlgVC: any): void

    public static showDialog(dlgVC: any, position: IPopupPosition, onClose?: any ): void;

    public static showContextMenu(menuItems: IPopupMenuItem[], position: IPopupPosition): void;

    public static showDescription(description: string, position: IPopupPosition): void;
}
