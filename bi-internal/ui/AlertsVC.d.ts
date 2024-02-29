import {BaseService} from '../core/BaseService'

export enum AlertType {
    NEWS = 'news',
    INFO = 'info',
    INFO_IMPORTANT = 'info_important', // todo ?
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
}


export interface IAlert {
    type: AlertType;
    title?: string;
    description: string;
    stackId?: string;
    onPressClose?: () => void;
    created?: number;
}


export interface IAlertsVM {
    readonly loading: boolean;
    readonly error: string | null;
    readonly alertItems: IAlert[];
}

export class AlertsVC extends BaseService<IAlertsVM> {
    private constructor();

    public static getInstance(): AlertsVC

    public pushAlert(rawAlert: IAlert, timeout?: number): void 

    public pushNewsAlert(description: string, title?: string, timeout?: number): void;

    public pushInfoAlert(description: string, title?: string, timeout?: number): void;

    public pushSuccessAlert(description: string, title?: string, timeout?: number): void;

    public pushDangerAlert(description: string, title?: string, timeout?: number): void;

    public pushWarningAlert(description: string, title?: string, timeout?: number): void



    public static pushAlert(rawAlert: IAlert): void;

    public static pushNewsAlert(description: string, title?: string, timeout?: number): void;

    public static pushInfoAlert(description: string, title?: string, timeout?: number): void;

    public static pushSuccessAlert(description: string, title?: string, timeout?: number): void;

    public static pushDangerAlert(description: string, title?: string, timeout?: number): void;
    
    public static pushWarningAlert(description: string, title?: string, timeout?: number): void;
}

export default AlertsVC;
