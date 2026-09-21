import { IUrl } from './core';
import type { IConfigHelper, IDashboard, IDashlet, IDashletsHelper, IDatasetModel, IVizelConfig } from './defs/types';
import type { IAxis, IColorPair, IColorResolver, IEntity, ILocation, ILocationArea, ILocationCard, ILocationCardField, ILocationsHelper, IMetric, IPeriod, IPeriodsHelper, IPreset, IRange, ISpatial, IStoplight, IStoplights, ISubspacePtr, ITag, ITitleResolver, ITreeNode, IUnit, IValue, IVizelConfigDisplay } from './defs/bi';
type Unit = IUnit;
type Metric = IMetric;
type Location = ILocation;
type Period = IPeriod;
import { tables } from './defs/bi';
/**
 * @deprecated
 * @description Пожалуйста используйте обращение к конфигу
 */
export declare class VizelConfigDisplay implements IVizelConfigDisplay {
    private readonly _raw;
    private readonly _stoplights;
    readonly group: any;
    constructor(raw: tables.IRawVizelConfigDisplay);
    clone(): VizelConfigDisplay;
    hasRange(): boolean;
    getRange(): IRange | null;
    getSort(): string | null;
    getLimit(): number | null;
    getSortBy(): string;
    getVAxisWidth(): number;
    setSort(v: string): void;
    disableRange(): void;
    getGradient(): string | null;
    getStackGroupIndex(e: IEntity): number;
    /**
     * @deprecated Используйте vizel_config.getStoplights
     */
    getStoplights(): IStoplights | null;
    /**
     * @param v
     * @deprecated Используйте vizel_config.getStoplight
     */
    getStoplight(v: IValue): IStoplight;
}
/**
 * @deprecated Не используйте этот класс, конфиг сейчас создается через объект func createConfig
 */
export declare class VizelConfig implements IVizelConfig {
    private _countConsoleLog;
    private readonly _options;
    private _subspacePtr;
    controller: any;
    private _display;
    private _raw;
    dataSource: tables.IDataSource;
    display: tables.IRawVizelConfigDisplay;
    options: string[];
    onClickDataPoint: string | any;
    onClick: string | any;
    /**
     * @deprecated
     */
    readonly _dataset: IDatasetModel;
    /**
     * @deprecated
     */
    private _title;
    view_class: string;
    /**
     * @deprecated
     */
    showLegend: boolean;
    description: string;
    legend: {
        [id: string]: tables.ILegendItem;
    };
    badValueColor: string;
    goodValueColor: string;
    cardId: string;
    externalUrl: IUrl;
    dashboardId: string;
    dashId: string;
    normStrategy: string;
    context: any;
    titleContext: string[];
    colorResolver: IColorResolver;
    titleResolver: ITitleResolver;
    chartStyle: string;
    constructor(ds: IDatasetModel, raw?: tables.IRawVizelConfig);
    /**
     * @deprecated
     */
    get title(): string;
    /**
     * @deprecated
     */
    get dataset(): IDatasetModel;
    /**
     * @deprecated
     */
    getDataset(): IDatasetModel;
    /**
     * @deprecated
     * @method
     * @description Возвращает тип визеля (значения ключа view_class)
     */
    getVizelType(): string;
    /**
     * @deprecated
     * @method
     * @description Устанавливает тип визеля (значения ключа view_class)
     */
    setVizelType(vizelType: string): void;
    /**
     * @deprecated
     * @method
     * @description Возвращает объект subspacePtr
     */
    getSubspacePtr(): ISubspacePtr;
    /**
     * @deprecated
     * @method
     * @description Отдает склонированый конфиг визеля
     */
    getRaw(): tables.IRawVizelConfig;
    /**
     * @deprecated
     * @return {IStoplights}
     * @description Возвращает значения из конфига визеля display:{ stoplights:any };
     */
    getStoplights(): IStoplights | null;
    /**
     * @deprecated
     * @param v
     * @param vizelType
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    getStoplight(v: number, vizelType?: string): IStoplight;
    /**
     * @deprecated
     * @param {string} optionId - имя опции
     * @param {any} defaultValue - Зн-ие если опции не найдена.
     * @return {boolean | undefined}
     * @description Метод ищет эту опцию в конфиги визеля, массив options, если не нашёл, то ищет в конфиги Датасета
     */
    getOption(optionId: string, defaultValue?: any): boolean | null;
    /**
     * @deprecated
     * @param optionId
     */
    getOptionCount(optionId: string): number;
    private _getOptionFromDatasetConfig;
    /**
     * @deprecated
     * @param optionId
     * @param value
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    setOption(optionId: string, value: boolean): void;
    /**
     * @deprecated
     * @param {string} optionId - имя опции
     * @description Метод ищет опцию в конфиги визеля, в массиве options
     */
    hasOption(optionId: string): boolean;
    /**
     * @deprecated
     * @param optionId
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    addOption(optionId: string): boolean;
    /**
     * @deprecated
     * @param optionId
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    removeOption(optionId: string): boolean;
    /**
     * @deprecated
     * @method
     * @return {string | null}
     * @description возвращает значение ключа url, в конфиги визеля
     */
    getUrl(): string | null;
    /**
     * @deprecated
     * @method
     * @return {string | null}
     * @description возвращает значение ключа bgImage, в конфиги визеля
     */
    getBgImage(): string | null;
    /**
     * @deprecated
     * @param key
     * @description not implemented
     */
    getProperty(key: any): any;
    /**
     * @deprecated
     * @param key
     * @param value
     * @description not implemented
     */
    setProperty(key: string, value: any): void;
    /**
     * @deprecated пожалуйста начните использовать vizel_config.getLegendItem
     * @param {IEntity} e - сущность оси
     * @param idx
     * @description Ищет в dataSource.style объект, * | axisId | axisId[id], в МЛП ( metrics[mId], locations[lId], periods[pId])
     */
    getLegendItem(e: IEntity, idx?: number): tables.ILegendItem;
    private _getLegendColorPair;
    private _getLegendColor;
    private _getLegendBgColor;
    private _getLegendTitle;
    /**
     * @deprecated
     * @param {IEntity} e - сущность оси
     * @param {number} v
     * @param idx
     * @description Наследует цвет из colorResolver | ищет цвет в style | выбирает цвет из colorPallete
     */
    getColor(e: IEntity, v: number, idx?: number): string;
    /**
     * @deprecated
     * @param {IEntity} e - сущность оси
     * @param {number} v
     * @param idx
     * @description Наследует фон из colorResolver | ищет цвет в style | выбирает цвет из colorPallete
     */
    getBgColor(e: IEntity, v: number, idx?: number): string;
    /**
     * @deprecated
     * @param e
     * @param v
     * @param idx
     */
    getColorPair(e: IEntity, v?: IValue, idx?: number): IColorPair;
    /**
     * @deprecated
     * @param {IEntity} e - сущность
     * @description Ищет title в titleResolver | ищет ключ title в style
     */
    getTitle(e: IEntity): string;
    /**
     * @param {IEntity} e - сущность
     * @description Ищет ключ format в style
     */
    getFormat(e: IEntity): string;
    /**
     * @deprecated
     * @param title
     */
    setTitle(title: string): void;
    /**
     * @deprecated
     */
    getDisplay(): IVizelConfigDisplay;
    /**
     * @deprecated
     */
    getRange(): IRange;
    /**
     * @deprecated
     */
    disableRange(): void;
    /**
     * @deprecated
     */
    serialize(): tables.IRawVizelConfig;
    clone(): IVizelConfig;
}
export declare class TreeNode<T> implements ITreeNode<T> {
    axisId: string;
    id: number | string;
    parent: T;
    root: T;
    children: T[];
    constructor(parent?: T);
    addChild(child: T): T;
    getChildren(): T[];
    getDescendants(): T[];
    getParent(): T;
}
export declare class Tag extends TreeNode<ITag> implements ITag {
    axisId: string;
    id: number | string;
    title: string;
    children: Tag[];
    parent: Tag;
    root: Tag;
    constructor(id: number | string, title?: string, parent?: Tag);
    addChild(child: ITag): ITag;
    appendTo(parent: ITag): ITag;
    getChildById(id: string): ITag;
}
export declare class TagGroup extends Tag implements IAxis<ITag> {
    children: Tag[];
    axisId: string;
    entities: ITag[];
    constructor(id: string, title?: string);
    getTag(idx: number): ITag;
    addTags(tags: ITag[]): ITag;
}
export declare class ConfigHelper implements IConfigHelper {
    private config;
    constructor(rawConfigs: tables.IConfigItem[], rawDsConfig: any);
    update(rawConfigs: tables.IConfigItem[], rawDsConfig: any): void;
    private _addData;
    addData(configItems: tables.IConfigItem[]): void;
    private _addHashData;
    addHashData(items: any): void;
    private _getValue;
    hasValue(key: string): boolean;
    private _getGlobalConfigValue;
    getValue(key: string, defaultValue?: any): any;
    getStringValue(key: string, defaultValue?: string): string;
    getIntValue(key: string, defaultValue?: number): number;
    getFloatValue(key: string, defaultValue?: number): number;
    getBoolValue(key: string, defaultValue?: boolean | null): boolean | null;
    getEnumValue(key: string, values: string[], defaultValue?: string): string;
    getStringArray(key: string, defaultValue?: string[]): string[];
    getIntArray(key: string, defaultValue?: number[]): number[];
    getEnterUrl(schema_name: string): IUrl;
}
export declare class PeriodsHelper implements IPeriodsHelper {
    private _defaultPeriodType;
    periods: Period[];
    private periodsByPt;
    private _periodTypes;
    private _tagGroups;
    constructor(raws: tables.IPeriodsItem[], startupPeriodType: number);
    update(rawPeriods: tables.IPeriodsItem[], startupPeriodType: number): void;
    private _createEntity;
    private _rebuildPeriodsByPt;
    private _rebuildTree;
    private _setupTagsOnPeriod;
    private _addPeriod;
    addPeriods(ps: tables.IPeriodsItem[]): void;
    private setDefaults;
    getPeriodsByTypeId(periodTypeId: number): IPeriod[];
    getPeriodsByDatesAndType(from: any, to: any, periodType: number): IPeriod[];
    getAvailablePeriodTypes(): number[];
    getDefaultPeriodType(): number;
    getTagGroup(tagGroupName: string): TagGroup;
    isFirst(p: IPeriod): boolean;
    isLast(p: IPeriod): boolean;
}
export declare class UnitsHelper {
    entities: Unit[];
    units: Unit[];
    constructor(raws: tables.IUnitsItem[]);
    update(raws: tables.IUnitsItem[]): void;
    private _createEntity;
}
export declare class LocationCardFieldsHelper {
    entities: ILocationCardField[];
    constructor(raws: tables.ILocationCardField[], metrics: IMetric[]);
    update(raws: tables.ILocationCardField[], metrics: IMetric[]): void;
    private _createEntity;
}
export declare class LocationCardsHelper {
    entities: ILocationCard[];
    constructor(raws: tables.ILocationCard[], locationCardFields: ILocationCardField[]);
    update(raws: tables.ILocationCard[], locationCardFields: ILocationCardField[]): void;
    private _createEntity;
}
export declare class LocationAreasHelper {
    entities: ISpatial[];
    constructor(raws: tables.ILocationArea[]);
    update(raws: tables.ILocationArea[]): void;
    private _createEntity;
}
export declare class MetricsHelper {
    metrics: Metric[];
    rootMetrics: Metric[];
    private _tagGroups;
    constructor(raws: tables.IMetricsItem[], units: Unit[], ch: ConfigHelper);
    update(raws: tables.IMetricsItem[], units: Unit[]): void;
    private _createEntity;
    protected _rebuildTree(): Metric[];
    getTagGroup(tagGroupName: string): TagGroup;
}
export declare class LocationsHelper implements ILocationsHelper {
    locations: Location[];
    roots: Location[];
    tagAxes: {
        [axisId: string]: TagGroup;
    };
    constructor(raws: tables.ILocationsItem[], locationCards: ILocationCard[], locationAreas: ILocationArea[]);
    update(raws: tables.ILocationsItem[], locationCards: ILocationCard[], locationAreas: ILocationArea[]): void;
    private _createEntity;
    protected _rebuildTree(): Location[];
    getTagGroup(tagGroupName: string): TagGroup;
}
export declare class PresetsHelper {
    entities: IPreset[];
    constructor(raws: tables.IPresetsItem[], metrics: IMetric[]);
    update(raws: tables.IPresetsItem[], metrics: IMetric[]): void;
    private _createEntity;
}
interface IContextPtr {
    readonly schema_name?: string;
    readonly dashboard?: number | string;
    readonly dashlet?: number | string;
}
/**
 * @description Вспомогательный клас
 */
export declare class SubspacePtr implements ISubspacePtr {
    readonly koob: string;
    readonly lookupId: string | number;
    readonly dataSource: tables.IDataSource;
    readonly schema_name: string;
    readonly dashboard: number;
    readonly dashlet: number;
    readonly having: string;
    readonly metricsDrilldown: number;
    readonly locationsDrilldown: number;
    readonly disableLoadData: boolean;
    readonly loadAllData: boolean;
    readonly hackDisableSort: boolean;
    private readonly axesOrder;
    private readonly combineAxes;
    private readonly _isCombine;
    constructor(dataSource: tables.IDataSource, options: string[], context: IContextPtr);
    private static __tagNameRE;
    static isTaggedAxisId(axisId: string): boolean;
    static extractTaggedAxisId(axisId: string): [string, string];
    /**
     * @method
     * @return {string[] || null}
     * @description Возвращает id метрик из dataSource
     * @deprecated
     */
    getMIds(): string[];
    /**
     * @method
     * @return {string[] || null}
     * @description Возвращает id локаций из dataSource
     * @deprecated
     */
    getLIds(): string[];
    getPIds(): string[] | {
        start?: string;
        end?: string;
        type?: number;
        qty?: number;
    };
    getPType(): string;
    /**
     * @method
     * @description Возвращает информацию их dataSource по осям xAxis,yAxis,zAxis и MLP тегам
     * @return {xAxis: string[], yAxis: string[], zAxis: string[], tags: string[][] }
     */
    getCombineAxes(): {
        xAxis: string[];
        yAxis: string[];
        zAxis: string[];
        tags: string[][];
    };
    /**
     *
     * @param axisName  the name of axis ('metrics', 'locations', ... 'tagged-root')
     */
    getAxisEntityIds(axisName: string): string | string[];
    /**
     * @method
     * @return {boolean}
     * @description Проверяем MLP на наличии комбинированных осей или осей с тэгами
     * @deprecated
     */
    isCombine(): boolean;
    getAxesOrder(): string[];
}
export declare class Dashlet {
    axisId: string;
    id: string;
    parentId: string;
    title: string;
    description: string;
    layout: string;
    children: Dashlet[];
    legend: any;
    private _dataset;
    private _dashboard;
    private _frame;
    private _raw;
    constructor(dataset: IDatasetModel, dashboard: Dashboard, raw: tables.IDashletsItem);
    update(raw: tables.IDashletsItem): void;
    getRawVizelConfig(): tables.IRawVizelConfig;
    getDataset(): IDatasetModel;
    getDashboard(): IDashboard;
    getFrame(): tables.IConfigFrame;
    getDescription(): string;
    isContainer(): boolean;
    isRoot(): boolean;
    addChild(child: Dashlet): void;
}
export declare class Dashboard {
    axisId: string;
    id: string;
    stateColor: string;
    title: string;
    config: any;
    topic_id: number;
    _is_editable: number;
    srt: number;
    private _rootDashes;
    private _dashes;
    private _dashesById;
    private _dataset;
    constructor(dataset: IDatasetModel, d: tables.IDashboardsItem);
    update(rawDashboard: tables.IDashboardsItem): void;
    addDash(raw: tables.IDashletsItem): void;
    getDash(dashId: string): Dashlet;
    getDashes(): Dashlet[];
    getRootDashes(): Dashlet[];
}
export declare class DashletsHelper {
    dashboardTopics: tables.IDashboardTopic[];
    dashboards: Dashboard[];
    private _dataset;
    constructor(dataset: IDatasetModel, rawDashboards: tables.IDashboardsItem[], rawDashboardTopics: tables.IDashboardTopic[], rawDashlets: tables.IDashletsItem[]);
    update(rawDashboards: tables.IDashboardsItem[], rawDashboardTopics: tables.IDashboardTopic[], rawDashlets: tables.IDashletsItem[]): void;
    private _saveDashboard;
    private _addDashboard;
    private _addDashlet;
    private addDashboards;
    private addDashes;
    getDash(id: string): Dashlet;
    getDashes(): Dashlet[];
    getDashboard(dashboardId: string): Dashboard;
}
export {};
