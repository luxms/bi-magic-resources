import { BaseService } from '../core';
export declare const COLOR_PALETTE: string[];
export interface IThemeVM {
    readonly error: string;
    readonly loading: boolean;
    readonly themes: Record<string, any>;
    readonly currentTheme: Record<string, any>;
    readonly currentThemeId: string;
    /**
     * @deprecated зачем нам вот это вот, если colorPalette хранится в currentTheme | themes[themeId]
     */
    readonly colorPalette: string[];
}
/**
 * @class
 * @instance
 * @description Сервис подтягивает из ресурсов themes.json, темы могут лежать как в ds_res, так и в отдельной папке датасета ds_... .
 * Если в ресурсах ничего нет, тема берется из bi-face,
 */
export declare class ThemeVC extends BaseService<IThemeVM> {
    private _themesJsonService;
    private readonly _currentUserService;
    private _resourceByNameEvaluatorService;
    protected constructor();
    protected _dispose(): void;
    private _onServiceUpdated;
    private _onServiceModuleUpdated;
    setTheme(currentThemeId: string): void;
    private _setThemeModule;
    static applyThemeToElement(themeId: string, theme: any, element: HTMLElement): void;
    private _applyThemeVariables;
    static getInstance: () => ThemeVC;
}
