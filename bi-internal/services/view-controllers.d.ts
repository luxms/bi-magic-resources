import {BaseService} from '../core/BaseService'
import { IDatasetModel, IDsState, IDsStateService } from '../defs/types';
import { IRootSegment } from './plugins';
import { ISummaryModel } from './services';

export interface ISearchVM {
    readonly loading: boolean;
    readonly error: string;
    readonly search: string;
}
/**
 * @class
 * @instance
 * @description Сервис хранит ввод пользователя в "поиск", используется в Наборе данных. Использует внутри подписку на UrlState (При смене url, search:null) *
 */
export class SearchVC extends BaseService<ISearchVM> {
    protected constructor();
    /**
     * @method
     * @description Инициализация SearchVC service
     * */
    public static getInstance ():SearchVC;
    /**
     * @method
     * @description обновляет модель, не обернут в debounce
     * */
    public setSearch(search: string):void;
}

export interface IDsShellVM {
    viewClassId: 'DsShell';
    loading?: boolean;
    error?: string;
    id: string;
    schema_name: string;
    schemaName: string;
    eastPanel: any;
    westPanel: any;
    northPanel: any;
    eastPanelEnabled: boolean;
    westPanelEnabled: boolean;
    northPanelEnabled: boolean;
    datasetTitle: string;
    datasetDescriptionHTML: string;
    datasetUrl: string;
    route: string;                        // TODO: remove
    // children
    toggleEastPanel?: () => void;
    toggleWestPanel?: () => void;
    toggleNorthPanel?: () => void;
    dataset: IDatasetModel;
    state: IDsStateService;
    key: string;
}

export interface IPopupPosition {
    left?: number;
    top?: number;
    right?: number;
}

export interface IPopupMenuItem {
    title: string;
    onPress: () => void;
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


interface IDepsModels {
    dsState: IDsState;
}
export interface IAdmShellVM {
    loading?: boolean;
    error?: string;
    viewClassId: 'AdmShell';
}
export interface IRootVM {
    viewClassId: 'Root/Root';
    error: string;
    loading: boolean;
    tabs: IRootSegment[];
    summary: ISummaryModel;
    activeTabIndex: number;
    activeTab: IRootSegment;
    showHeader: boolean;
}

export interface IShellVM {
    loading: boolean;
    error: string;
    authenticated: boolean;
    authError: string | null;
    isAuthenticationBlocked: boolean;
    popup?: IPopupVM;
    segment: IDsShellVM | IRootVM | IAdmShellVM;
}

export class ShellVC extends BaseService<IShellVM> {
    public constructor();
    protected _onDepsUpdated(newDepsModels: IDepsModels, prevDepsModels: IDepsModels): boolean;
}

export class DsShellVC extends BaseService<IDsShellVM> {
    public id: string;
    public constructor(dsId: string);

    protected _onDepsReadyAndUpdated(depsModels: IDepsModels, prevDepsModels: IDepsModels);
}

export interface IThemeVM {
    readonly error: string;
    readonly loading: boolean;
    readonly themes: any;
    readonly currentTheme: any;
    readonly currentThemeId: string;
}

/**
 * @class
 * @instance
 * @description Сервис подтягивает из ресурсов themes.json, темы могут лежать как в ds_res, так и в отдельной папке датасета ds_... .
 * Если в ресурсах ничего нет, тема берется из bi-face,
 */
export class ThemeVC extends BaseService<IThemeVM> {
    protected constructor();
    /**
     * @method
     * @description Инициализация ThemeVC service
     * */
    public static getInstance():ThemeVC;

    /**
     * @method
     * @description Переключение темы (светлая-темная-..-...) themes.json = { [currentThemeId:string]: {[vars:strng]:string} }
     * */
    public setTheme(currentThemeId: string): void;
    public static applyThemeToElement(themeId: string, theme: any, element: HTMLElement): void;
}