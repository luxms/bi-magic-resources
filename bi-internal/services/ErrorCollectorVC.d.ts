import { BaseService } from '../core';
import { type IAlert } from '../ui/AlertsVC';
interface IError {
    readonly message: string;
    readonly created: number;
    readonly detailedMessage: string;
    readonly type: string;
    readonly dataset: string;
}
export interface IErrorCollectorVM {
    readonly loading: boolean;
    readonly error: string | null;
    readonly errorItems: IError[];
    readonly isModalVisible: boolean;
}
export declare class ErrorCollectorVC extends BaseService<IErrorCollectorVM> {
    private constructor();
    protected _dispose(): void;
    static getInstance: () => ErrorCollectorVC;
    saveMessage(rawError: IAlert, ctx?: any): void;
    saveWarningMessage(description: string, ctx?: any): void;
    saveErrorMessage(description: string, ctx?: any): void;
    static saveMessage(rawError: IAlert, ctx?: any): void;
    static saveWarningMessage(description: string, ctx?: any): void;
    static saveErrorMessage(description: string, ctx?: any): void;
}
export default ErrorCollectorVC;
export declare function extractErrorTitle(rawMessage: any): string;
export declare function extractErrorMessage(rawMessage: string | {
    message: string;
}): string;
export declare function extractErrorDetailed(rawDescription: any): string;
