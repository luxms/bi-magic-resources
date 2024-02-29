import { BaseService } from './BaseService';
interface IAppConfig {
    loading: boolean;
    error: string;
    requestUrls: any;
    projectTitle: string;
    locale: string;
    language: 'en' | 'ru';
    region: string;
    features: string[];
    plugins: string[];
    entryPoint: any;
    dataset: any;
    map: any;
    themes?: any;
    keycloak?: any;
}
export declare class AppConfig extends BaseService<IAppConfig> {
    MODEL: IAppConfig;
    constructor();
    protected _createInitialModel(): any;
    private _loadSettingsJs;
    hasFeature(featureName: string): boolean;
    /**
     * Replaces parts of URL according to settings
     *
     * @param url URL to proceed
     * @returns {string} resulting URL
     */
    fixRequestUrl(url: string): string;
    static getInstance: () => AppConfig;
    static getModel(): IAppConfig;
    static fixRequestUrl(url: string): string;
    static hasFeature(featureName: string): boolean;
    static getProjectTitle(): string;
    static getLocale(): string;
    static getLanguage(): 'en' | 'ru';
    static getPlugins(): string[];
}
export {};
