import { Observable } from './core/Observable';
import { IUrl } from './core/UrlState/UrlState';
import {tables, IVizelConfigDisplay, IRange, IEntity, IStoplights, IValue, IStoplight, IColorResolver, ITitleResolver, ISubspacePtr, IColorPair, IOptionsProvider, ITreeNode, ITag, IAxis, IPeriodsHelper, IPeriod, IUnit, ILocationCardField, IMetric, ILocationCard, ISpatial, ITaggedEntity, ILocationsHelper, ILocationArea, IPreset} from './defs/bi';
import {IConfigHelper, IDashboard, IDashlet, IDashletsHelper, IDatasetModel, IVizelConfig} from './defs/types';
type IDataSourceStyle = tables.IDataSourceStyle;



// TODO: add limit, sort
export declare class VizelConfigDisplay {
    public constructor(dataset: IDatasetModel, raw: tables.IVizelConfigDisplay)

    public clone(): VizelConfigDisplay 

    public hasRange(): boolean 

    public getRange(): IRange | null 

    public getSort(): string | null 

    public getLimit(): number | null 

    public getSortBy(): string 

    public getVAxisWidth(): number 

    public setSort(v: string): void 

    public disableRange(): void 

    public getGradient(): string | null

    public getStackGroupIndex(e: IEntity): number 

    public getStoplights(): IStoplights | null 

    public getStoplight(v: IValue): IStoplight 
}


export class VizelConfig implements IVizelConfig {
    public readonly dataset: IDatasetModel;
    public dataSource: tables.IDataSource;
    public view_class: string;
    public display: tables.IVizelConfigDisplay;
    public controller: any
    public title: string;
    public description: string;
    public legend: { [id: string]: tables.ILegendItem; }
    public badValueColor: string;
    public goodValueColor: string;
    public onClickDataPoint: string | any;
    public onClick: string | any;
    public cardId: string;
    public externalUrl: IUrl;
    public dashboardId: string;
    public dashId: string;
    public normStrategy: string;
    public context: any;
    public titleContext: string[];
    public colorResolver: IColorResolver
    public titleResolver: ITitleResolver
    // deprecated
    public chartStyle: string;
    public showLegend: boolean;

    public constructor(ds: IDatasetModel, raw?: tables.IRawVizelConfig, view_class?: string)

    public getDataset(): IDatasetModel;

    /**
     * @method
     * @description Возвращает тип визеля (значения ключа view_class)
     */
    public getVizelType(): string;

    /**
     * @method
     * @description Устанавливает тип визеля (значения ключа view_class)
     */
    public setVizelType(vizelType: string):void;

    /**
     * @method
     * @description Возвращает объект subspacePtr
     */
    public getSubspacePtr(): ISubspacePtr;

    /**
     * @method
     * @description Отдает склонированый конфиг визеля
     */
    public getRaw(): tables.IRawVizelConfig;

    /**
     * @return {IStoplights}
     * @description Возвращает значения из конфига визеля display.stoplights
     */
    public getStoplights(): IStoplights | null;

    /**
     * @param v
     * @param vizelType
     * @deprecated
     * @description Менять напрямую объект.
     */
    public getStoplight(v: number, vizelType?: string): IStoplight ;

    /**
     * @param {string} optionId - имя опции
     * @param {any} defaultValue - Зн-ие если опции не найдена.
     * @return {boolean | undefined}
     * @description Метод ищет эту опцию в конфиги визеля, массив options, если не нашёл ищет в конфиги Датасета
     */
    public getOption(optionId: string, defaultValue?: any): boolean | null;

    public getOptionCount(optionId: string): number;

    /**
     * @param optionId
     * @param value
     * @deprecated
     * @description  Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    public setOption(optionId: string, value: boolean): void;

    /**
     * @param {string} optionId - имя опции
     * @description Метод ищет опцию в конфиги визеля, в массиве options
     */
    public hasOption(optionId: string): boolean;

    /**
     * @param optionId
     * @deprecated
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    public addOption(optionId: string): boolean;

    /**
     * @param optionId
     * @deprecated
     * @description Меняет напрямую объект options, не сигнализирует об обновлении конфига!!
     */
    public removeOption(optionId: string): boolean;

    /**
     * @method
     * @return {string | null}
     * @description возвращает значение ключа url, в конфиги визеля
     */
    public getUrl(): string;

    /**
     * @method
     * @return {string | null}
     * @description возвращает значение ключа bgImage, в конфиги визеля
     */
    public getBgImage(): string;

    /**
     * @param key
     * @description not implemented
     */
    public getProperty(key): any;

    /**
     * @param key
     * @param value
     * @description not implemented
     */
    public setProperty(key: string, value: any): void;

    /**
     * @param {IEntity} e - сущность оси
     * @param idx
     * @description Ищет в dataSource.style объект, axisId[id], в МЛП ( metrics[mId], locations[lId], periods[pId]);
     */
    public getLegendItem(e: IEntity, idx?: number): tables.ILegendItem;

    /**
     * @param {IEntity} e - сущность оси
     * @param {number} v
     * @param idx
     * @description Наследует цвет из colorResolver | ищет цвет в style | выбирает цвет из skin.colorPallete
     */
    public getColor(e: IEntity, v: number, idx?: number): string;

    /**
     * @param {IEntity} e - сущность оси
     * @param {number} v
     * @param idx
     * @description Наследует фон из colorResolver | ищет цвет в style | выбирает цвет из skin.colorPallete
     */
    public getBgColor(e: IEntity, v: number, idx?: number): string; 

    public getColorPair(e: IEntity, v?: IValue, idx?: number): IColorPair;

    /**
     * @param {IEntity} e - сущность
     * @description Ищет title в titleResolver | ищет ключ title в style
     */
    public getTitle(e: IEntity): string;

    /**
     * @param {IEntity} e - сущность
     * @description Ищет ключ format в style
     */
    public getFormat(e: IEntity): string; 

    public setTitle(title: string): void; 

    public getDisplay(): IVizelConfigDisplay; 

    public getRange(): IRange; 

    public disableRange(): void; 

    public serialize(): tables.IRawVizelConfig;

    public clone(): IVizelConfig;
}


export class TreeNode<T> implements ITreeNode<T> {
    public axisId: string
    public id: number | string;
    public parent: T 
    public root: T
    public children: T[]

    public constructor(parent?: T) 

    public addChild(child: T): T 

    public getChildren(): T[] 

    public getDescendants(): T[] 

    public getParent(): T 
}


export class Tag extends TreeNode<ITag> implements ITag {
    public axisId: string;
    public id: number | string;
    public title: string;

    public children: Tag[]
    public parent: Tag;
    public root: Tag;

    public constructor(id: number | string, title?: string, parent?: Tag)

    public addChild(child: ITag): ITag 

    public appendTo(parent: ITag): ITag 

    // deprecated: use $eid(tag.children, id)
    public getChildById(id: string): ITag 
}


// keep right order of tags
export class TagGroup extends Tag implements IAxis<ITag> {
    public children: Tag[]
    public axisId: string;
    public entities: ITag[]

    public constructor(id: string, title?: string)

    public getTag(idx: number): ITag 

    public addTags(tags: ITag[]): ITag 
}

//
//  Config Helper
//
export class ConfigHelper implements IConfigHelper {

    public constructor(rawConfigs: tables.IConfigItem[], rawDsConfig: any)

    public update(rawConfigs: tables.IConfigItem[], rawDsConfig: any): void

    public addData(configItems: tables.IConfigItem[]): void 

    public addHashData(items: any): void 

    public hasValue(key: string): boolean 

    public getValue(key: string, defaultValue?: any): any

    public getStringValue(key: string, defaultValue?: string): string 

    public getIntValue(key: string, defaultValue?: number): number

    public getFloatValue(key: string, defaultValue?: number): number 

    public getBoolValue(key: string, defaultValue?: boolean | null): boolean | null

    public getEnumValue(key: string, values: string[], defaultValue?: string): string 

    public getStringArray(key: string, defaultValue?: string[]): string[] 

    public getIntArray(key: string, defaultValue?: number[]): number[]

    public getEnterUrl(schema_name: string): IUrl
}


//
//  PeriodsHelper class
//
export class PeriodsHelper extends Observable implements IPeriodsHelper {

    public constructor(raws: tables.IPeriodsItem[], startupPeriodType: number)

    public update(rawPeriods: tables.IPeriodsItem[], startupPeriodType: number): void 

    public addPeriods(ps: tables.IPeriodsItem[]): void 

    private setDefaults(defaultPtId?: number): void 

    public getPeriodsByTypeId(periodTypeId: number): IPeriod[] 

    public getPeriodsByDatesAndType(from, to, periodType: number): IPeriod[]

    public getAvailablePeriodTypes(): number[]

    public getDefaultPeriodType(): number 

    public getTagGroup(tagGroupName: string): TagGroup 

    public isFirst(p: IPeriod): boolean 

    public isLast(p: IPeriod): boolean 
}
export class Unit implements IUnit {
    public axisId: string
    public axis_title: string;
    public id: number;
    public config: any;
    public unit_id: number;
    public tiny_title: string;
    public title: string;
    public value_prefix: string;
    public value_suffix: string;
    public color: string;

    public constructor(d: tables.IUnitsItem)

    public update(d: tables.IUnitsItem): void 

    public toString(): string 

    public isInteger(): boolean 
}
export class TaggedEntity implements ITaggedEntity {
    public rawTags: string[]

    public constructor() 

    public getTagByGroupId(tagGroupName: string): ITag

    public getTagIdByGroupId(tagGroupName: string): number | string 

    public getTags(): ITag[]

    public getTag(id: string | number): ITag 

    public addTag(tag: ITag): this 
}
export class Metric extends TaggedEntity implements IMetric {
    public axisId: string;
    public id: string;
    public parent_id: string;
    public title: string;

    public key: string;
    public tree_level: number;
    public unit_id: number;
    public is_text_val: number;                                                   // 0 | 1
    public config: any;
    public is_hidden: number;
    public srt: number;
    public description: string;
    public parentId: string;

    public children: Metric[];
    public parent: Metric;
    public root: Metric;

    public unit: Unit;
    public color: string;

    public constructor(raw: tables.IMetricsItem) 

    public update(raw: tables.IMetricsItem): void 

    public setParent(parent: Metric): void 

    public getParent(): IMetric 

    public getTitlePath(): string 

    public getAltTitle(titleType: string): string
}
export class UnitsHelper {
    public entities: Unit[]

    public constructor(raws: tables.IUnitsItem[]) 

    public update(raws: tables.IUnitsItem[]) 
}
export class LocationCardFieldsHelper {
    public entities: ILocationCardField[];

    public constructor(raws: tables.ILocationCardField[], metrics: IMetric[]) 

    public update(raws: tables.ILocationCardField[], metrics: IMetric[]) 
}
export class LocationCardsHelper {
    public entities: ILocationCard[];

    public constructor(raws: tables.ILocationCard[], locationCardFields: ILocationCardField[]) 

    public update(raws: tables.ILocationCard[], locationCardFields: ILocationCardField[])
}
export class LocationAreasHelper {
    public entities: ISpatial[];

    public constructor(raws: tables.ILocationArea[])

    public update(raws: tables.ILocationArea[]) 
}

//
// MetricsHelper class
//   organize working with parameters
//
export class MetricsHelper {
    public metrics: Metric[];

    public constructor(raws: tables.IMetricsItem[], units: Unit[], ch: ConfigHelper) 

    public update(raws: tables.IMetricsItem[], units: Unit[]): void 


    protected _rebuildTree(): Metric[]

    public getTagGroup(tagGroupName: string): TagGroup 
}

export class LocationsHelper implements ILocationsHelper {
    public locations: Location[];
    public roots: Location[];
    public tagAxes: { [axisId: string]: TagGroup };
    public constructor(raws: tables.ILocationsItem[], locationCards: ILocationCard[], locationAreas: ILocationArea[]) 
    public update(raws: tables.ILocationsItem[], locationCards: ILocationCard[], locationAreas: ILocationArea[]) 
    protected _rebuildTree(): Location[]
    public getTagGroup(tagGroupName: string): TagGroup
}

export class PresetsHelper {
    public entities: IPreset[];

    public constructor(raws: tables.IPresetsItem[], metrics: IMetric[]) 

    public update(raws: tables.IPresetsItem[], metrics: IMetric[]) 
}

export class SubspacePtr implements ISubspacePtr {
    public readonly koob: string;
    public readonly lookupId: string | number;
    public readonly dataSource: tables.IDataSource;

    public readonly metricsDrilldown: number;
    public readonly locationsDrilldown: number;
    public readonly disableLoadData: number;
    
    public constructor(dataSource: tables.IDataSource, options?: IOptionsProvider, doSwapXY?: boolean);

    // TODO: consider make this method private (it is currently used in model)
    public static isTaggedAxisId(axisId: string): boolean 

    public static extractTaggedAxisId(axisId: string): [string, string] 

    public getMIds(): string[] 

    public getLIds(): string[] 

    public getPIds(): string[] | { start?: string; end?: string; type?: number; qty?: number }

    public getPType(): string 

    public getCombineAxes(): { xAxis: string[], yAxis: string[], zAxis: string[], tags: string[][] } 

    /**
     *
     * @param axisName  the name of axis ('metrics', 'locations', ... 'tagged-root')
     */
    public getAxisEntityIds(axisName: string): string | string[] 

    public isCombine(): boolean 

    public getAxesOrder(): string[] 
}

export class Dashlet implements IDashlet {
    public axisId: string;
    public id: string;
    public parentId: string;

    public title: string;
    public description: string;
    public layout: string;                     // V|H|''

    public children: Dashlet[];
    public legend: any;


    public constructor(dataset: IDatasetModel, dashboard: Dashboard, raw: tables.IDashletsItem)

    public update(raw: tables.IDashletsItem): void 

    public getRawVizelConfig(): tables.IRawVizelConfig 

    public getDataset(): IDatasetModel 

    public getDashboard(): IDashboard 

    public getFrame(): tables.IConfigFrame

    public getDescription(): string 

    public isContainer(): boolean 

    public isRoot(): boolean 

    public addChild(child: Dashlet): void 
}


export class Dashboard implements IDashboard {
    public axisId: string;
    public id: string;
    public stateColor: string;
    public title: string;
    public config: any;
    public topic_id: number;

    public constructor(dataset: IDatasetModel, d: tables.IDashboardsItem) 

    public update(rawDashboard: tables.IDashboardsItem): void 

    public addDash(raw: tables.IDashletsItem): void 

    public getDash(dashId: string): Dashlet 

    public getDashes(): Dashlet[] 

    public getRootDashes(): Dashlet[]
}


export class DashletsHelper implements IDashletsHelper {
    public dashboardTopics: tables.IDashboardTopic[];
    public dashboards: Dashboard[];


    public constructor(dataset: IDatasetModel, rawDashboards: tables.IDashboardsItem[], rawDashboardTopics: tables.IDashboardTopic[], rawDashlets: tables.IDashletsItem[]) 

    public update(rawDashboards: tables.IDashboardsItem[], rawDashboardTopics: tables.IDashboardTopic[], rawDashlets: tables.IDashletsItem[]): void 


    public getDash(id: string): Dashlet 

    public getDashes(): Dashlet[] 

    public getDashboard(dashboardId: string): Dashboard 
}
