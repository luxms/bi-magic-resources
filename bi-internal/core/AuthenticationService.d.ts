/**
 *
 *
 *
 * notifications:
 *  - update
 *  - sign-in
 *  - sign-out
 *
 */
import { BaseService, IBaseModel } from './BaseService';
import { IDisposable } from './Observable';
import { IRawUser, IRawUserConfig } from './repositories/adm';
interface IAuthCheckData2 {
    sessionId: string;
    user: IRawUser;
    authType?: string;
}
interface IAuthCheckData3 {
    access_level: string;
    id: string;
    name: string;
    authType?: string;
    config: IRawUserConfig;
}
export interface IAuthentication extends IBaseModel {
    error: string | null;
    loading: boolean;
    authenticating: boolean;
    authenticated: boolean;
    userId?: number;
    access_level?: string;
    username?: string;
    name?: string;
    userConfig?: {
        [key: string]: string;
    };
    isNeed2FACode?: boolean;
    isBlocked?: boolean;
    errorKey?: string;
    errorMessage?: string;
    violationMessages?: string[];
}
export declare class AuthenticationService extends BaseService<IAuthentication> {
    private _keycloak;
    private constructor();
    private _init;
    protected _setModel(m: IAuthentication): void;
    isAuthenticated(): boolean;
    private _check;
    check(): Promise<IAuthCheckData2 | IAuthCheckData3>;
    private _notifyLoggedOut;
    signIn(username: string, password: string, new_password?: string): Promise<IAuthentication>;
    signOut(): Promise<any>;
    resendCode(): Promise<any>;
    signInWithCode(code: string): Promise<any>;
    static readonly NOT_AUTHENTICATED: string;
    static readonly FORCE_LOGIN_KEY = "loginme";
    static readonly NO_SSO_KEY = "no-sso";
    static getInstance: () => AuthenticationService;
    static getModel(): IAuthentication;
    static subscribeUpdatesAndNotify(listener: (model: IAuthentication) => void): IDisposable;
    static subscribeUpdates(listener: (model: IAuthentication) => void): IDisposable;
    static unsubscribe(listener: (...args: any[]) => any): boolean;
    static signOut(): Promise<any>;
    static signInWithCode(code: string): Promise<any>;
    static signIn(username: string, password: string): Promise<IAuthentication>;
    static resendCode(): Promise<any>;
}
export {};
