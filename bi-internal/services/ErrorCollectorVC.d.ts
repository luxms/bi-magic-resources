import { BaseService } from '../core';
import { IAlert } from '../ui/AlertsVC';

export interface IErrorCollectorItem {
    readonly message: string;
    readonly created: number;
    readonly detailedMessage: string;
    readonly type: string;
    readonly dataset: string;
}

export interface IErrorCollectorVM {
    readonly loading: boolean;
    readonly error: string | null;
    readonly errorItems: IErrorCollectorItem[];
    readonly isModalVisible: boolean;
}

/** Stores client-side errors so they can be shown in the error collector UI. */
export class ErrorCollectorVC extends BaseService<IErrorCollectorVM> {
    public static getInstance(): ErrorCollectorVC;
    public saveMessage(rawError: IAlert, ctx?: any): void;
    public saveWarningMessage(description: string, ctx?: any): void;
    public saveErrorMessage(description: string, ctx?: any): void;
    public static saveMessage(rawError: IAlert, ctx?: any): void;
    public static saveWarningMessage(description: string, ctx?: any): void;
    public static saveErrorMessage(description: string, ctx?: any): void;
}

export default ErrorCollectorVC;

export function extractErrorTitle(rawMessage: any): string;
export function extractErrorMessage(rawMessage: string | { message: string }): string;
export function extractErrorDetailed(rawDescription: any): string;
